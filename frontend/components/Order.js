import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
	query SINGLE_ORDER_QUERY($id: ID!)
	{
		order(id: $id)
		{
			id
			charge
			total
			createdAt
			user {
				id
			}
			items {
				id
				title
				description
				price
				image
				quantity
			}
		}
	}
`;


export default class Order extends React.Component
{
	static propTypes = {
		id: PropTypes.string.isRequired,
	};


	render()
	{
		return(
			<Query 
				query={SINGLE_ORDER_QUERY}
				variables={{id: this.props.id}}
			>
				{({data, error, loading}) => {
					if(error) return <Error error={error} />
					if(loading) return <p>Loading...</p>
					// console.log(data);
					// retrieves data from order
					const order = data.order;
					return (
						<OrderStyles>
							<Head>
								<title>Sick Fits - Order {order.id}</title>
							</Head>
							<p>
								<span>Order ID:</span>
								<span>{order.id}</span>
							</p>

							<p>
								<span>Charge</span>
								<span>{order.charge}</span>
							</p>

							<p>
								<span>Date</span>
								<span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
							</p>

							<p>
								<span>Item Count</span>
								<span>{order.items.length}</span>
							</p>

							<p>
								<span>Total</span>
								<span>{formatMoney(order.total)}</span>
							</p>

							<div className="items">
								{/*Rename "order.items" to item*/}
								{order.items.map(item => (
									<div key={item.id} className="order-item">
										<img src={item.image} alt={item.title} />
										<div className="item-details">
											<h2>{item.title}</h2>
											<p>Quantity: {item.quantity}</p>
											<p>Each: {formatMoney(item.price)}</p>
											<p>Sub Total: {formatMoney(item.quantity * item.price)}</p>
											<p>{item.description}</p>
										</div>
									</div>
								))}
							</div>
						</OrderStyles>
					);
				}}
			</Query>
		);
	}
}
export { SINGLE_ORDER_QUERY };