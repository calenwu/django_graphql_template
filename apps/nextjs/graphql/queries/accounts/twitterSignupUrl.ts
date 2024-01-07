import { gql } from '@apollo/client';

const TWITTER_SIGNUP_URL = gql`
	query {
		twitterSignup 
	}
`

interface twitterSignupUrlProps {
	twitterSignup: string;
}

export { TWITTER_SIGNUP_URL };
export type { twitterSignupUrlProps };