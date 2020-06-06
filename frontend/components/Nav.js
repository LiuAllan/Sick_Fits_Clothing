import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from '../components/Signout';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';

//Nav bar is inside Header.js that calls our web pages

// Stateless functional component
const Nav = () => (

			<User>
				{({data: { me }}) => (
				<NavStyles data-test="nav">
					<Link href="/items">
						<a>Shop</a>
					</Link>

					{/*Only display the buttons once they are signed in*/}
					{me && (
						<>
							<Link href="/sell">
								<a>Sell</a>
							</Link>

							<Link href="/orders">
								<a>Orders</a>
							</Link>

							{/*<Link href="/permissions">*/}
							<Link href="/permissions">
								<a>Account</a>
							</Link>


							{/*Sign out*/}
							<Signout />

							{/*We import our TOGGLE_CART_MUTATION from Cart.js which will need to use Mutation
							we pass the mutation through a variable 'mutation' and the function we want to use in between the tags.
							We then make the button onClick to run the function inside Apollo (withData.js) from Cart.js*/}
							<Mutation mutation={TOGGLE_CART_MUTATION}>
								{(toggleCart) => (
								<button onClick={toggleCart}>
									My Cart<CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)} />
								</button>
								)}
							</Mutation>
						</>
					)}

					{/*If no user is logged in*/}
					{!me && (
						<Link href="/signup">
							<a>Sign In</a>
						</Link>
					)}

				</NavStyles>
				)}
			</User>

)
export default Nav;