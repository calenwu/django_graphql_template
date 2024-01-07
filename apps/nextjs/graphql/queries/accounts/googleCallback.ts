import { gql } from '@apollo/client';

const GOOGLE_CALLBACK = gql`
	query {
		googleSignupCallback {
			email
			redirect
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

interface googleCallbackProps {
	googleSignupCallback: {
		email: string,
		redirect: string,
		token: string,
		payload: {
			email: string,
			exp: number,
			origIat: number
		},
		refreshExpiresIn: number
	}
}

export { GOOGLE_CALLBACK };
export type { googleCallbackProps };
