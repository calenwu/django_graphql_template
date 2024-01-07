'use client';
import { Button, CardOverlayContent, Input } from '@/components/elements/index';
import { MouseEventHandler, useState } from 'react';

export default function SignInForm({
	switchToSignIn,
	close,
} : {
	switchToSignIn: MouseEventHandler<HTMLButtonElement>,
	close: MouseEventHandler<HTMLButtonElement>,
}) {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const [password, setPassword] = useState('');
	const [passwordHidden, setPasswordHidden] = useState(false);

  return <div className='max-w-screen-md w-full p-8'>
		<CardOverlayContent 
			title='Forgot password'
			close={close}
			children={
				<>
					<h2 className='font-semibold mb-2'>
						Welcome to Summarize
					</h2>
					<p className='mb-4'>
						Enter your email address and we'll send you a link to reset your password.
					</p>
					<form>
							<Input
								label={'Email'}
								value={email}
								error={emailError}
								placeholder={'patrickc@gmail.com'}
								onChange={(e) => setEmail(e.target.value)}
								type={'email'}
								autoFocus={true}
							/>
						<div className='mb-4'>
						</div>
						<Button onClick={() => {}}>
							Reset password
						</Button>
					</form>
					<p className='text-right mt-4'>
						Got your password?
						<span className='ml-1 link-primary' onClick={switchToSignIn}>
							Sign in
						</span>
					</p>
				</>
			}
		/>
	</div>
}
