import { gql } from '@apollo/client';

interface refreshProps {
	data: {
		refreshToken: {
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

const REFRESH_TOKEN_QUERY = gql`
	mutation RefreshToken($token: String!) {
		refreshToken(token: $token) {
			token
			payload
			refreshExpiresIn
		}
	}
`

export { REFRESH_TOKEN_QUERY };
export type { refreshProps };