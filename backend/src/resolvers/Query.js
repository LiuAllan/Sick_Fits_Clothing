const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
	items: forwardTo('db'),
	item: forwardTo('db'),
	itemsConnection: forwardTo('db'),
	me(parent, args, ctx, info)
	{
		// check if there is a current user ID
		if(!ctx.request.userId)
		{
			return null;
		}
		// there is a user ID, then return the user
		return ctx.db.query.user(
		{
			where: { id: ctx.request.userId },
		},
		info
		);
	},
	// async items(parent, args, ctx, info)
	// {
	// 	const items = await ctx.db.query.items();
	// 		return items;
	// }
	async users(parent, args, ctx, info)
	{
		//Check if they are logged in
		if(!ctx.request.userId)
		{
			throw new Error('You must logged in!');
		}
		//Check user has permission to query all the users***********************
		// hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
		hasPermission(ctx.request.user, ['USER']);

		//if they do: query all the users
		return ctx.db.query.users({}, info);
	},
};

module.exports = Query;
