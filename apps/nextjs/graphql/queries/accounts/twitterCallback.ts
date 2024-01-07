import { gql } from '@apollo/client';

const TWITTER_CALLBACK = gql`
	query {
		twitterSignupCallback {
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

interface twitterCallbackProps {
	twitterSignupCallback: {
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

export { TWITTER_CALLBACK };
export type { twitterCallbackProps };
