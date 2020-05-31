import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

//This is similar to writing queries in the playground
const SIGN_OUT_MUTATION = gql`
	mutation SIGN_OUT_MUTATION
	{
		signout
		{
			message
		}
	}
`;

//Need to pass the mutation as  a parameter so we can actually use it!
const Signout = props => 
(

	<Mutation 
		mutation={SIGN_OUT_MUTATION}
		refetchQueries={[{query: CURRENT_USER_QUERY}]}
	>
		{
			(signout) => <button onClick={signout}>Sign Out</button>
		}
	</Mutation>
)

export default Signout;