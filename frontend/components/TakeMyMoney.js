import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import Nprogress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
	mutation createOrder($token: String!)
	{
		createOrder(token: $token)
		{
			id
			charge
			total
			items {
				id
				title
			}
		}
	}
`;


function totalItems(cart)
{
	return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

const skey = "pk_test_51Gq18ZER6f7pD7T5ACGDjD9l9t4AgsJAwLdPYytTtRrVyEkeQaM952FipqF47A7gm7Kki1SN9leFDafmad5UeLtf00cUYoVKOE"


class TakeMyMoney extends React.Component
{
	onToken = async(res, createOrder) =>
	{
		Nprogress.start();
		// console.log("Token Called!")
		// console.log(res.id);
		//Manually call the mutation once we have the stripe token
		const order = await createOrder(
		{
			variables: {
				token: res.id
			}
		}).catch(err => {
				alert(err.message);
			});

		Router.push({
			pathname: '/order',
			query: {id: order.data.createOrder.id},
		});
	};

	render()
	{
		return(
			/*User component to expose the user's cart*/
			<User>
				{({ data:  { me }, loading }) => {
				if(loading) return null;
				return (
					<Mutation
						mutation={CREATE_ORDER_MUTATION} 
						refetchQueries={[{query: CURRENT_USER_QUERY}]}
					>
					{createOrder => (
						<StripeCheckout
							amount={calcTotalPrice(me.cart)}
							name="Sick Fits"
							description={`Order of ${totalItems(me.cart)} items`}
							image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
							stripeKey={skey}
							currency="USD"
							email={me.email}
							token={res => this.onToken(res, createOrder)}
						>
							{this.props.children}
						</StripeCheckout>
					)}
					</Mutation>
				);
			}}
			</User>
		);
	}
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };








