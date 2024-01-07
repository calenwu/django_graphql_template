
import { gql } from '@apollo/client';

interface changeEmailProps {
	data: {
		changeEmail: {
			success: boolean,
		}
	}
}

const CHANGE_EMAIL = gql`
	mutation ChangeEmail($email: String!) {
		changeEmail(email: $email) {
			success
		}
	}
`

export { CHANGE_EMAIL };
export type { changeEmailProps };