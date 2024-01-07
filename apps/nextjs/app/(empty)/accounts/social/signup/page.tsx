'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_SOCIAL, signupSocialProps } from '@/graphql/mutations/accounts/signupSocial';
import { Button, Input } from '@/components/elements/index';
import { FormMessage, MessageType } from '@/components/form/index';
import { errorDictToString } from '@/utils/utils';
import { CONTACT, HOME, USER_SETTINGS } from '@/utils/routes';
import { ButtonColor } from '@/components/elements/button';
import { URL_PARAM_SHOW_SIGNIN_UP } from '@/utils/const';
export default function Page() {
  const email = localStorage.getItem('signupEmail');
	const [emailValue, setEmailValue] = useState<string>(email ? email.toString() : '');
	const [emailError, setEmailError] = useState<string>(
		'An account already exists with this email address. Please sign in to that account first, then connect your account.'
	);
	const [formError, setFormError] = useState<string>('');
	const [signUpSocialMutation, {
		data: signUpSocial,
		loading: signUpSocialLoading,
		error: signUpSocialError,
	}] = useMutation<signupSocialProps>(SIGNUP_SOCIAL, {
		variables: { email: emailValue },
		onCompleted: (data) => {
			localStorage.setItem('token', data.signUpSocial.token);
			localStorage.setItem('tokenExp', data.signUpSocial.payload.exp.toString());
			localStorage.setItem('tokenRefreshExp', data.signUpSocial.refreshExpiresIn.toString());
			window.location.href = USER_SETTINGS;
		},
		onError: (error) => {
			console.log(error);
			setEmailError(errorDictToString('email', error));
			setFormError(errorDictToString('__all__', error));
		},
	});

	function handleSubmit() {
		signUpSocialMutation();
	}


  return <>
		<h1 className='mb-4'>
			Sign in
		</h1>
		<p className='mb-4'>
			You already have an account with us with the same email where you used a password to sign in.
			<br/>
			Please log into your account and then add the social login to your account in the settings menu.
		</p>
		<Button className='mb-8' onClick={() => window.location.href = `${HOME}?${URL_PARAM_SHOW_SIGNIN_UP}=true`}>
			Sign in
		</Button>
		<h1 className='mb-4'>
			Sign up
		</h1>
		<p className='mb-4'>
			Otherwise you can also create a new account but you need to associate a different email address with this account.
		</p>
		{formError && 
			<FormMessage messageType={MessageType.Error} title={'Error'}>
				{formError}
			</FormMessage>
		}
		<form onSubmit={(e) => {e.preventDefault(); signUpSocialMutation();}}>
			<Input
				label='Email'
				onChange={e => {setEmailValue(e.target.value); setEmailError('');}}
				value={emailValue}
				error={emailError}/>
			<div className='mb-6'/>
			<Button buttonColor={ButtonColor.Secondary} onClick={() => signUpSocialMutation()} loading={signUpSocialLoading}>
				Sign up anyway
			</Button>
		</form>
	</>
}
