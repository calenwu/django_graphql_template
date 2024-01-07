

import { gql } from '@apollo/client';

const TWITTER_CONNECT = gql`
	query TwitterConnect {
		twitterConnect
	}
`

interface twitterConnectProps {
	twitterConnect: string
}

export { TWITTER_CONNECT };
export type { twitterConnectProps };
