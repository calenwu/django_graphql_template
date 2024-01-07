
import { gql } from '@apollo/client';

const USER_SETTINGS = gql`
	query UserSettings {
		userSettings {
			firstName
			lastName
			emailaddressSet {
				email
				primary
				verified
			}
			socialaccountSet {
				uid
				provider
				email
			}
		}
	}
`

interface userSettingsProps {
	userSettings: {
		firstName: string,
		lastName: string,
		emailaddressSet: emailaddress[],
		socialaccountSet: socialaccount[],
	}
}
interface emailaddress {
	email: string,
	primary: boolean,
	verified: boolean,
}

interface socialaccount {
	uid: string,
	provider: string,
	email: string,
}


export { USER_SETTINGS };
export type { userSettingsProps, socialaccount, emailaddress };
