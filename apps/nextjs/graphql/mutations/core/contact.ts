import { gql } from '@apollo/client';

interface contactProps {
	contact: {
		success: boolean
	}
}

const CONTACT = gql`
	mutation Contact($name: String!, $email: String!, $message: String, $recaptcha: String) {
		contact(name: $name, email: $email, message: $message, recaptcha: $recaptcha) {
			success
		}
	}
`

export { CONTACT };
export type { contactProps };

