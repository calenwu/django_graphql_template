
import { gql } from '@apollo/client';

interface disconnectSocialProps {
	data: {
		disconnectSocial: {
			success: boolean,
		}
	}
}

const DISCONNECT_SOCIAL = gql`
	mutation DisconnectSocial($uid: String!) {
		disconnectSocial(uid: $uid) {
			success
		}
	}
`

export { DISCONNECT_SOCIAL };
export type { disconnectSocialProps };

