
import { gql } from '@apollo/client';

interface signupSocialProps {
	signUpSocial: {
		token: string,
		payload: {
			email: string,
			exp: number,
			origIat: number
		},
		refreshExpiresIn: number,
	}
}

const SIGNUP_SOCIAL = gql`
	mutation SignupSocial($email: String!) {
		signupSocial(email: $email) {
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

export { SIGNUP_SOCIAL };
export type { signupSocialProps };