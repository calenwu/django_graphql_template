'use client';
import { MouseEventHandler, useState } from 'react';
import { Button, CardOverlayContent, Input, Svg } from '@/components/elements/index';


export default function SignInForm({
	switchToSignIn,
	close
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
			title={'Sign up'}
			close={close}
			children={
				<>
					<h2 className='font-semibold mb-2'>
						Welcome to Summarize
					</h2>
					<p className='text-right mb-2'>
						Already have an account? <span className='link-primary' onClick={switchToSignIn}>Sign in</span>
					</p>
					<form>
						<div className='mb-4'>
							<Input
								label={'Email'}
								value={email}
								error={emailError}
								placeholder={'patrickc@gmail.com'}
								onChange={(e) => setEmail(e.target.value)}
								type={'email'}
							/>
						</div>
						<div className='mb-4'>
							<Input
								label={'Password'}
								value={password}
								hidden={passwordHidden}
								error={emailError}
								placeholder={'*******'}
								onChange={(e) => setPassword(e.target.value)}
								type={'password'}
								/>
						</div>
						<Button onClick={() => {}}>
							Sign in
						</Button>
					</form>
					<div className='relative flex justify-center w-full
							my-2'>
						<div className='w-16 text-center z-10
								bg-white
								p-2 '>
							or
						</div>
						<div className='absolute h-0.5 w-full inset-y-1/2 -translate-y-1/2 z-0
								bg-gray-500'>
						</div>
					</div>
					<div>
						<Button onClick={() => {}}>
							<Svg className='absolute inset-y-1/2 -translate-y-1/2 left-2 w-4 h-4'
									src='/fontawesome/svgs/brands/google.svg'/>
							Continue with Google
						</Button>
						<div className='mb-4'/>
						<Button onClick={() => {}}>
							<Svg className='absolute inset-y-1/2 -translate-y-1/2 left-2 w-4 h-4'
									src='/fontawesome/svgs/brands/twitter.svg'/>
							Continue with X
						</Button>
					</div>
				</>
			}
		/>
	</div>
}
