import { gql } from '@apollo/client';

interface signUpProps {
	data: {
		createUser: {
			token: string,
			payload: {
				email: string,
				exp: number,
				origIat: number
			},
			refreshExpiresIn: number,
		}
	}
}

const SIGN_UP_QUERY = gql`
	mutation CreateUser($email: String!, $password: String!) {
		createUser(email: $email, password: $password) {
			user {
				email
			}
		}
	}
`

export { SIGN_UP_QUERY };
export type { signUpProps };