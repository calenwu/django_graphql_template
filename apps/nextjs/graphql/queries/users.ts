import { gql } from '@apollo/client';

const USERS = gql`
	query {
		users {
			id
			email
		}
	}
`

interface usersProps {
	users: {
		email: string,
		id: string,
	}
}

export { USERS };
export type { usersProps };
