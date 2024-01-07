import { gql } from '@apollo/client';

interface signInProps {
	data: {
		tokenAuth: {
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

const REFRESH_TOKEN_QUERY = gql`
	mutation TokenAuth($email: String!, $password: String!) {
		tokenAuth(email: $email, password: $password) {
			token
			payload
			refreshExpiresIn
		}
	}
`

export { REFRESH_TOKEN_QUERY };
export type { signInProps };