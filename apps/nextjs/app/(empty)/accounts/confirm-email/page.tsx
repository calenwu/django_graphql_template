export default function Page() {
	return <div>
		<h1 className='mb-4'>
			Email confirmation needed
		</h1>
		<p className='mb-4'>
			You already created an account with email and password. 
			<br/>
			Please click on the link in the email to confirm your email.
		</p>
		<img className='w-full' src='/imgs/email_confirmed.webp'/>
	</div>
}