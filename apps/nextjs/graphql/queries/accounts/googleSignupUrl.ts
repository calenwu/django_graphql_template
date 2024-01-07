import { gql } from '@apollo/client';

const GOOGLE_SINGUP_URL = gql`
	query {
		googleSignup 
	}
`

interface googleSignupUrlProps {
	googleSignup: string,
}

export { GOOGLE_SINGUP_URL };
export type { googleSignupUrlProps };