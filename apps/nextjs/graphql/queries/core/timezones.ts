import { gql } from '@apollo/client';

const TIMEZONES = gql`
	query Timezones {
		timezones 
	}
`

interface timezonesProps {
	timezones: [
		[string, string]
	]
}

export { TIMEZONES };
export type { timezonesProps };
