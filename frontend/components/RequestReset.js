import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!)
	{
		requestReset(email: $email)
		{
			message
		}
	}
`;

export default class RequestReset extends React.Component
{
	state = {
		email: '',
	};
	//Handle the state when user clicks on the input box. Function saveToState with paramets (event)
	saveToState = (event) =>
	{
		this.setState({ [event.target.name]: event.target.value });
	}


	render()
	{
		return(
			<Mutation 
				mutation={REQUEST_RESET_MUTATION} 
				variables={this.state}
				>
				{(reset, { error, loading, called }) => {
				return(<Form 
					method="post" 
					onSubmit={async event => {
						event.preventDefault();
						await reset();
						// console.log(res);
						this.setState({ email: '' });
					}}>
					<fieldset disabled={loading} aria-busy={loading}>
						<h2>Request a password reset</h2>
						<Error error={error} />
						{!error && !loading && called && <p>Check your email for a reset link</p>}
						<label htmlFor="email">
							Email
							<input 
								type="email"
								name="email"
								placeholder="email"
								value={this.state.email}
								onChange={this.saveToState}
							/>
						</label>

						<button type="submit">Request Reset</button>
					</fieldset>
				</Form>)
				}}
			</Mutation>
		);
	}
}