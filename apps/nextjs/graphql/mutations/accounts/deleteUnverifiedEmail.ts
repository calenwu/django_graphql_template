import { gql } from '@apollo/client';

interface deleteUnverifiedEmailProps {
	data: {
		deleteUnverifiedEmail: {
			success: boolean,
		}
	}
}

const DELETE_UNVERIFIED_EMAIL = gql`
	mutation DeleteUnverifiedEmail ($email: String!) {
		deleteUnverifiedEmail (email: $email) {
			success
		}
	}
`

export { DELETE_UNVERIFIED_EMAIL };
export type { deleteUnverifiedEmailProps };