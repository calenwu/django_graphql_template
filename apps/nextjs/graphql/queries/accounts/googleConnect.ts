

import { gql } from '@apollo/client';

const GOOGLE_CONNECT = gql`
	query GoogleConnect {
		googleConnect
	}
`

interface googleConnectProps {
	googleConnect: string
}

export { GOOGLE_CONNECT };
export type { googleConnectProps };
