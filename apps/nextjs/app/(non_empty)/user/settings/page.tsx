'use client';
import EmailSection from './emailSection';
import PasswordSection from './passwordSection';
import SocialaccountSection from './socialaccountsSection';


export default function Page () {
	return <div>
		<div className='mb-8'>
			<EmailSection/>
		</div>
		<div className='mb-8'>
			<SocialaccountSection/>
		</div>
		<div>
			<PasswordSection/>
		</div>
	</div>
}
