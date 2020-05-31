import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { perPage } from '../config';
import Head from 'next/head';
import Link from 'next/link';

// itemsConnection == query name
const PAGINATION_QUERY = gql`
	query PAGINATION_QUERY
	{
		itemsConnection
		{
			aggregate {
				count
			}
		}
	}
`;

//Stateless function component
const Pagination = props => (
	<Query query={PAGINATION_QUERY}>
		{({data, loading, error}) => 
		{
			if(loading) return <p>Loading...</p>;
			if(error) return <p>Error</p>;
			const count = data.itemsConnection.aggregate.count;
			const pages = Math.ceil(count / perPage);
			// console.log(props);
			const page = props.page;
			return(
				<PaginationStyles>
					<Head>
						<title>
							Sick Fits! - Page {page} of {pages}
						</title>
					</Head>
					<Link 
						prefetch
						href={{
							pathname: 'items',
							query: { page: page - 1 }
						}}
					>
						<a className="prev" aria-disabled={page <= 1}>Prev</a>
					</Link>
						<p>Page {page} of {pages}</p>
						<p>{count} Items Total</p>
					<Link 
						prefetch
						href={{
							pathname: 'items',
							query: { page: page + 1 }
						}}
					>
						<a className="next" aria-disabled={page >= pages}>Next</a>
					</Link>
				</PaginationStyles>
			)
		}
		}
	</Query>
)

export default Pagination;