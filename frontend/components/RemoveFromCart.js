import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
	mutation removeFromCart($id: ID!)
	{
		removeFromCart(id: $id)
		{
			id
		}
	}
`;

const BigButton = styled.button`
	font-size: 3rem;
	background: none;
	border: 0;
	&: hover
	{
		color: ${props => props.theme.red};
		cursor: pointer;
	}
`;

export default class RemoveFromCart extends React.Component
{
	// Type checking. PropTypes exports a range of validators that can be used to make sure the data you receive is valid.
	static propTypes = {
		id: PropTypes.string.isRequired,
	};

	// this gets called as soon as we get a response back from the server after a mutation has been performed
	update = (cache, payload) => {
		// console.log("Running remove from cart from frontend")
		// read the cache
		const data = cache.readQuery({ query: CURRENT_USER_QUERY });
		// console.log(data);
		// remove that item from the cart in cache
		const cartItemId = payload.data.removeFromCart.id;
		data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
		// write it back to the cache
		cache.writeQuery({ query: CURRENT_USER_QUERY, data });
	};

	render()
	{
		return(
			<Mutation 
				mutation={REMOVE_FROM_CART_MUTATION} 
				variables={{id: this.props.id}} 
				update={this.update}
				optimisticResponse={{
					__typename: 'Mutation',
					removeFromCart: {
						__typename: 'CartItem',
						id: this.props.id,
					},
				}}
			>
				{(removeFromCart, {loading, error}) => (
						<BigButton
							disabled={loading}
							onClick={() => {removeFromCart().catch(err => alert(err.message))}}
							title="Delete Item">&times;</BigButton>
				)}
			</Mutation>
				
		);
	}
}
export { REMOVE_FROM_CART_MUTATION };