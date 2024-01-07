'use client';
import { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SIGNIN_OR_UP, signinOrUpProps } from '@/graphql/mutations/accounts/index';
import { 
	GOOGLE_SINGUP_URL,
	googleSignupUrlProps,
	TWITTER_SIGNUP_URL,
	twitterSignupUrlProps,
} from '@/graphql/queries/accounts/index';
import { Button, CardOverlayContent, Input, Svg } from '@/components/elements/index';
import { FormMessage, MessageType } from '@/components/form/index';
import { errorDictToString } from '@/utils/utils';
import { USER_SETTINGS } from '@/utils/routes';
import { NotificationContext, SnackNotificationType } from '@/context/NotificationContext';

export default function SignInUpForm({
	switchToForgotPassword,
	close
} : {
	switchToForgotPassword: MouseEventHandler<HTMLButtonElement>,
	close: MouseEventHandler<HTMLButtonElement>,
}) {
	const { addSnackNotification } = useContext(NotificationContext);

	const [formMessage, setFormMessage] = useState('');
	const [formError, setFormError] = useState('');

	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordHidden, setPasswordHidden] = useState(true);

	const [lengthPassed, setLengthPassed] = useState(false);
	const [captialPassed, setCapitalPassed] = useState(false);
	const [numberPassed, setNumberPassed] = useState(false);
	const [specialPassed, setSpecialPassed] = useState(false);

	const [
		signupGoogleUrl,
		{
			loading: signupGoogleUrlLoading,
		}] = useLazyQuery<googleSignupUrlProps>(GOOGLE_SINGUP_URL, {
			onCompleted: (data) => {
				window.location.href = data.googleSignup;
			},
			onError: (error) => {
				addSnackNotification(
					'Error while logging in via Google',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		});

	const [
		signUpTwitterUrl,
		{
			loading: signupTwitterUrlLoading,
		}] = useLazyQuery<twitterSignupUrlProps>(TWITTER_SIGNUP_URL, {
			onCompleted: (data) => {
				window.location.href = data.twitterSignup;
			},
			onError: (error) => {
				addSnackNotification(
					'Error while logging in via Twitter',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		});
	
	const [
		signinOrUp, { 
			loading: signinOrUpLoading, 
		}] = useMutation<signinOrUpProps>(SIGNIN_OR_UP, {
			variables: {
				'email': email,
				'password': password,
			},
			onCompleted: (data) => {
				if (data.signinOrUp.verified) {
					localStorage.setItem('token', data.signinOrUp.token);
					localStorage.setItem('tokenExp', data.signinOrUp.payload.exp.toString());
					localStorage.setItem('tokenRefreshExp', data.signinOrUp.refreshExpiresIn.toString());
					window.location.href = USER_SETTINGS;
				} else {
					setFormMessage(
						'An email has been sent to your email address. Please click the link in the email to verify your account.'
					);
					setFormError('');
				}
			},
			onError: (error) => {
				console.log(error);
				const allErrors = errorDictToString('__all__', error);
				if (allErrors === 'The email address and/or password you specified are not correct.') {
					setPasswordError(allErrors);
				} else {
					setFormError(allErrors);
				}
				setEmailError(errorDictToString('email', error));
			},
		});

	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const password = e.target.value;
		setPassword(e.target.value);
		if (password.length >= 8) {
			setLengthPassed(true);
		} else {
			setLengthPassed(false);
		}
		if (password.match(/[A-Z]/)) {
			setCapitalPassed(true);
		} else {
			setCapitalPassed(false);
		}
		if (password.match(/[0-9]/)) {
			setNumberPassed(true);
		} else {
			setNumberPassed(false);
		}
		if (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\| ,.<>\/?]+/)) {
			setSpecialPassed(true);
		} else {
			setSpecialPassed(false);
		}
		setPasswordError('');
	}
	
	useEffect(() => {
		const localEmail = localStorage.getItem('signupEmail');
		if (localEmail) {
			setEmail(localEmail);
			localStorage.removeItem('signupEmail');
		}
	}, []);

  return <div className='max-w-screen-md w-full p-8'>
		<CardOverlayContent 
			title={'Sign up or sign in'}
			close={close}
			children={
				<>
					<h2 className='font-semibold mb-2'>
						Welcome to Summarize
					</h2>
					<p className='mb-2'>
						If you your email is registered with us, we will log you in. Otherwise, we will create an account for you.
					</p>
					{}
					{formMessage && 
						<FormMessage messageType={MessageType.Success} title={'Verify Email'}>
							{formMessage}
						</FormMessage>
					}
					{formError && 
						<FormMessage messageType={MessageType.Error} title={'Error'}>
							{formError}
						</FormMessage>
					}
					<form onSubmit={(e) => {
							e.preventDefault();
							signinOrUp();
							setFormError('');
							setFormMessage('');
						}}>
						<div className='mb-4'>
							<Input
								label={'Email'}
								value={email}
								error={emailError}
								placeholder={'patrickc@gmail.com'}
								onChange={(e) => {setEmail(e.target.value); setEmailError('');}}
								type={'email'}
								autoFocus={true}
							/>
						</div>
						<div className='mb-4'>
							<div className='relative'>
								<Input
									label={'Password'}
									value={password}
									error={passwordError}
									placeholder={'*******'}
									onChange={onPasswordChange}
									type={passwordHidden ? 'password' : 'text'}
									/>
								<div className='absolute absolute-y-center right-2'
										onClick={() => {setPasswordHidden(!passwordHidden)}}>
									<Svg src={passwordHidden ? '/fontawesome/svgs/light/eye.svg' : '/fontawesome/svgs/light/eye-slash.svg'}
											className='w-6 h-6 cursor-pointer transition-colors
													bg-gray-400 hover:bg-black'/>
								</div>
							</div>
							<div className='flex justify-end'>
								<span className='text-sm link mt-2' onClick={switchToForgotPassword} tabIndex={0}>
									Forgot your password?
								</span>
							</div>
							<div>
								<p className={`text-sm mb-0 ${lengthPassed ? 'text-success' : 'text-error'}`}>
									Your password must contain at least 8 characters
								</p>
								<p className={`text-sm mb-0 ${captialPassed ? 'text-success' : 'text-error'}`}>
									Your password must contain a captial letter
								</p>
								<p className={`text-sm mb-0 ${numberPassed ? 'text-success' : 'text-error'}`}>
									Your password must contain a number
								</p>
								<p className={`text-sm mb-0 ${specialPassed ? 'text-success' : 'text-error'}`}>
									Your password must contain a special character
								</p>
							</div>
						</div>
						<Button disabled={!(lengthPassed && captialPassed && numberPassed && specialPassed)} 
								loading={signinOrUpLoading}>
							Continue
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
						<Button className='group' onClick={() => {signupGoogleUrl()}} loading={signupGoogleUrlLoading}>
							<Svg className='absolute inset-y-1/2 -translate-y-1/2 left-2 w-4 h-4 transition-colors
										bg-white group-hover:bg-primary-400'
									src='/fontawesome/svgs/brands/google.svg'/>
							Continue with Google
						</Button>
						<div className='mb-4'/>
						<Button className='group' onClick={() => {signUpTwitterUrl()}} loading={signupTwitterUrlLoading}>
							<Svg className='absolute inset-y-1/2 -translate-y-1/2 left-2 w-4 h-4 transition-colors
										bg-white group-hover:bg-primary-400'
									src='/fontawesome/svgs/brands/twitter.svg'/>
							Continue with X
						</Button>
					</div>
				</>
			}
		/>
	</div>
}
