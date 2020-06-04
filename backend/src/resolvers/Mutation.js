const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
	async createItem(parent, args, ctx, info) 
	{
		//TODO: check if they are logged in
		if(!ctx.request.userId)
		{
			throw new Error('You must be logged in to do that!');
		}

		const item = await ctx.db.mutation.createItem(
		{
			data: 
			{
				//this is how we create a relationship between the item and the user
				user: {
					connect: {
						id: ctx.request.userId,
					},
				},
				...args,
			},
		},
		info
		);
		// console.log(item);
		return item;
	},
	updateItem(parent, args, ctx, info)
	{
		//Take a copy of the updates
		const updates = { ...args };
		//remove the ID from the updates
		delete updates.id
		//run update method
		return ctx.db.mutation.updateItem(
		{
			data: updates,
			where: {
				id: args.id,
			}
		},
		info

		);
	},
	async deleteItem(parent, args, ctx, info)
	{
		// throw new Error('You are not allowed to delete this item!')
		const where = { id: args.id }; //retreive the item id
		// 1. Find the item
		const item = await ctx.db.query.item({where}, `{ id title user { id }}`);
		// 2. Check if they have permission or owns it
		const ownsItem = item.user.id === ctx.request.userId;

		//Compare the user permissions with access permissions and return true or false if there is overlap
		const hasPermissions = ctx.request.user.permissions.some
		(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

		if(!ownsItem && hasPermissions)
		{
			throw new Error("You don't have permission to delete this item!");
		}

		// 3. Delete it
		return ctx.db.mutation.deleteItem({ where }, info);
	},
	// createDog(parent, args, ctx, info) {
	// 	global.dogs = global.dogs || [];
	// 	// create a dog
	// 	const newDog = { name: args.name };
	// 	global.dogs.push(newDog);
	// 	return newDog;
	// },
	async signup(parent, args, ctx, info)
	{
		// lowercase their email
		args.email = args.email.toLowerCase();
		//hash their password
		const password = await bcrypt.hash(args.password, 10);
		// create user in the database
		const user = await ctx.db.mutation.createUser({
			data: {
				...args,
				password,
				permissions: { set: ['USER'] },
			},
		}, 
		info
		);
		// Create the JWT token for them
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// Set the jwt as a cookie on the response
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, //1 year cookie
		});
		//return the user to the browser
		return user;
	},
	// args take in arguements from schemagraphql of email and password. We destructure it directly
	async signin(parent, { email, password }, ctx, info)
	{
		// check if there is a user with that email
		const user = await ctx.db.query.user({where: {email}});
		// check password is correct
		if(!user)
		{
			throw new Error(`No such user found for email ${email}`);
		}
		const valid = await bcrypt.compare(password, user.password);
		if(!valid)
		{
			throw new Error(`Invalid Password!`);
		}
		// generate JWT token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// Set cookie with token
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, //1 year cookie
		});
		// return user
		return user;
	},
	signout(parent, args, ctx, info)
	{
		ctx.response.clearCookie('token');
		return { message: 'Successfully Signed out!' };
	},
	async requestReset(parent, args, ctx, info)
	{
		//Check if this is a real user
		const user = await ctx.db.query.user({ where: { email: args.email } });
		if(!user)
		{
			throw new Error(`No such user found for email ${args.email}`);
		}
		//Set reset token and expiry on that user
		const randomBytesPromisified = promisify(randomBytes);
		const resetToken = (await randomBytesPromisified(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 360000; // 1hour from now
		const res = await ctx.db.mutation.updateUser({
			where:{ email: args.email },
			data: { resetToken, resetTokenExpiry },
		});
		// console.log(res);
	
		//Email them that reset token
		const mailRes = await transport.sendMail({
			from: 'allan@allan.com',
			to: user.email,
			subject: 'SickFits: Password Reset',
			html: makeANiceEmail(`Your Password Reset Token: \n\n 
				<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset Password</a>`)
		})

		//return the message
		return { message: 'Thanks!'}
	},
	async resetPassword(parent, args, ctx, info)
	{
		// check if the passwords match
		if(args.password !== args.confirmPassword)
		{
			throw new Error(`Password does not match`);
		}
		// check if its a legit reset token
		// check if its expired
		const [user] = await ctx.db.query.users({
			where:
			{
				resetToken: args.resetToken,
				resetTokenExpiry_gte: Date.now() - 360000,
			},
		});
		if(!user)
		{
			throw new Error('This token is either invalid or expired');
		}
		// hash their new password
		const password = await bcrypt.hash(args.password, 10);
		// save the new password to the user and remove old resetToken
		const updatedUser = await ctx.db.mutation.updateUser({
			where: { email: user.email },
			data: {
				password,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});
		// generate JWT
		const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
		// Set JWT cookie
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, //1 year cookie
		});
		// return new user
		return updatedUser;
	},
	async updatePermissions(parent, args, ctx, info)
	{
		// 1. Check if they are logged in
		if(!ctx.request.userId)
		{
			throw new Error('You must be logged in.');
		}
		// 2. Query the current user
		const currentUser = await ctx.db.query.user({
			where: {
				id: ctx.request.userId,
			},
		},
		info);
		// 3. Check if they have permission to update permissions
		hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
		// 4. Update the permissions
	    return ctx.db.mutation.updateUser(
	      {
	        data: {
	          permissions: {
	            set: args.permissions,
	          },
	        },
	        where: {
	          id: args.userId,
	        },
	      },
	      info
	    );
	},
	async addToCart(parent, args, ctx, info)
	{
		// 1. Make sure user are signed in
		const {userId} = ctx.request;
		if(!userId)
		{
			throw new Error('You must be signed in');
		}
		// 2. Query the user's current cart
		const [existingCartItem] = await ctx.db.query.cartItems({
			where: {
				user: { id: userId },
				item: { id: args.id },
			}
		});
		// 3. check if that item is already in their cart and increment by 1 if it is
		if(existingCartItem)
		{
			// console.log('this item is already in their cart');
			return ctx.db.mutation.updateCartItem({
				where: { id: existingCartItem.id },
				data: { quantity: existingCartItem.quantity + 1 }
			}, info);
		}
		// 4. If not, create a fresh cartItem for that user
		return ctx.db.mutation.createCartItem({
			data: {
				user: {
					connect: { id: userId },
				},
				item: {
					connect: { id: args.id },
				},
			},
		},
		info
		);
	},
	async removeFromCart(parent, args, ctx, info)
	{
		// 1. Find the cart item
		const cartItem = await ctx.db.query.cartItem({
			where:
			{
				id: args.id,
			}
		}, `{id, user { id }}`
		);
		// Make sure we found an item
		if(!cartItem) throw new Error("No CartItem Found.");
		
		// 2. Make sure user owns that cart item
		if(cartItem.user.id !== ctx.request.userId)
		{
			throw new Error("You don't own this cart item");
		}
		// 3. Delete that cart item. [deleteCartItem found in our generated prisma file]
		return ctx.db.mutation.deleteCartItem({
			where: { id: args.id },
		}, info);
	},
	async createOrder(parent, args, ctx, info)
	{
		// Query the current user and make sure they are signed in
		const { userId } = ctx.request;
		if(!userId) throw new Error('You mught be signed in to complete this order!');
		const user = await ctx.db.query.user({ where: { id: userId }}, 
			`{
				id
				name
				email
				cart {
					id 
					quantity 
					item 
					{
						title price id description image largeImage
					}
				}
			}`);
		// recalculate the total for the price. People may change the price locally to 1 cent.
		const amount = user.cart.reduce((tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0);
		console.log(`Going to charge for a total of ${amount}`);
		// Create the stripe charge (turn token into MONEY)
		const charge = await stripe.charges.create({
			amount: amount,
			currency: "USD",
			source: args.token,
		});
		// convert the CartItems to OrderItems
		const orderItems = user.cart.map(cartItem => {
			const orderItem = {
				...cartItem.item,
				quantity: cartItem.quantity,
				user: { connect: {id: userId}},
			};
			delete orderItem.id;
			return orderItem;
		});
		// create the Order
		const order = await ctx.db.mutation.createOrder({
			data: {
				total: charge.amount,
				charge: charge.id,
				items: { create: orderItems },
				user: { connect: { id: userId }}
			}
		})
		// clean up the users cart, delete cartItems
		const cartItemIds = user.cart.map(cartItem => cartItem.id);
		await ctx.db.mutation.deleteManyCartItems({ where: {
			id_in: cartItemIds,
		}})
		// Return the Order to the client
		return order;
	},
};

module.exports = Mutations;
