import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!)
	{
		resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword)
		{
			id
			email
			name
		}
	}
`;

export default class Reset extends React.Component
{
	static PropTypes = {
		resetToken: PropTypes.string.isRequired,
	}

	state = {
		password: '',
		confirmPassword: ''

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
				mutation={REQUEST_MUTATION} 
				variables={{
					resetToken: this.props.resetToken,
					password: this.state.password,
					confirmPassword: this.state.confirmPassword,
					}}
				refetchQueries={[{ query: CURRENT_USER_QUERY }]}
				>
				{(reset, { error, loading, called }) => {
				return(<Form 
					method="post" 
					onSubmit={async event => {
						event.preventDefault();
						await reset();
						// console.log(res);
						this.setState({ password: '', confirmPassword: '' });
					}}>
					<fieldset disabled={loading} aria-busy={loading}>
						<h2>Reset your Password</h2>
						<label htmlFor="password">
							New Password
							<input 
								type="password"
								name="password"
								placeholder="password"
								value={this.state.password}
								onChange={this.saveToState}
							/>
						</label>

							<label htmlFor="confirmPassword">
							Confirm Password
							<input 
								type="password"
								name="confirmPassword"
								placeholder="confirmPassword"
								value={this.state.confirmPassword}
								onChange={this.saveToState}
							/>
						</label>

						<button type="submit">Reset Password</button>
					</fieldset>
				</Form>)
				}}
			</Mutation>
		);
	}
}