import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from '../components/Signout';

//Nav bar is inside Header.js that calls our web pages

// Stateless functional component
const Nav = () => (

			<User>
				{({data: { me }}) => (
				<NavStyles>
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
							<Link href="/me">
								<a>Account</a>
							</Link>


							{/*Sign out*/}
							<Signout />
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