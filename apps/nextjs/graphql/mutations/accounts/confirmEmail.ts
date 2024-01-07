
import { gql } from '@apollo/client';

interface confirmEmailProps {
	data: {
		accountConfirmEmail: {
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

const CONFIRM_EMAIL = gql`
	mutation AccountConfirmEmail($key: String!) {
		accountConfirmEmail(key: $key) {
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

export { CONFIRM_EMAIL };
export type { confirmEmailProps };