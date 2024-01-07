
import { gql } from '@apollo/client';

interface signinOrUpProps {
	signinOrUp: {
		verified: boolean
		token: string,
		payload: {
			email: string,
			exp: number,
			origIat: number
		},
		refreshExpiresIn: number,
	}
}

const SIGNIN_OR_UP = gql`
	mutation SigninOrUp($email: String!, $password: String!) {
		signinOrUp(email: $email, password: $password) {
			verified
			token
			payload {
				email
				exp
				origIat
			}
			refreshExpiresIn
		}
	}
`

export { SIGNIN_OR_UP };
export type { signinOrUpProps };