'use client';
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { CONTACT, contactProps } from '@/graphql/mutations/core/contact'
import { Button, Input, InputType, Textarea } from '@/components/elements'
import { FormMessage, MessageType } from '@/components/form'
import { errorDictToString } from '@/utils/utils'
import { RECAPTCHA_SITE_KEY } from '@/utils/const';
import { TextareaType } from '@/components/elements/textarea';
import Card from '@/components/containers/card';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (key: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function Page() {
	const [name, setName] = useState<string>('');
	const [nameError, setNameError] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [emailError, setEmailError] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [messageError, setMessageError] = useState<string>('');
	const [formError, setFormError] = useState<string>('');
	const [recaptcha, setRecaptcha] = useState<string>('');
	const [
		contact, 
		{
			loading: contactLoading,
		}
	] = useMutation<contactProps>(CONTACT, {
		variables: {
			'name': name,
			'email': email,
			'message': message,
			'recaptcha': recaptcha,
		},
		onCompleted: (data) => {
			console.log(data);
		},
		onError: (error) => {
			try {
				setFormError(errorDictToString('__all__', error));
				setNameError(errorDictToString('name', error));
				setEmailError(errorDictToString('email', error));
				setMessageError(errorDictToString('message', error));
			} catch (e) {
				
			}
		}
	});

	const handleLoaded = () => {
		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(RECAPTCHA_SITE_KEY, { action: 'homepage' })
				.then((token: any) => {
					setRecaptcha(token);
				})
		})
	}

	useEffect(() => {
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
		script.addEventListener('load', handleLoaded);
		document.body.appendChild(script);
	}, [])

	return <>
		<div className='max-w-screen-md mx-auto'>
			<h1 className='mb-4'>
				Contact
			</h1>
			<p className='mb-6'>
				Please use the form below to contact us.
			</p>
			<Card>
				{formError ? 
					<FormMessage title='Error' messageType={MessageType.Error}>
						{formError}
					</FormMessage>
					:
					null
				}
				<form onSubmit={(e) => {e.preventDefault(); contact();}}>
					<Input
						label='Name'
						placeholder='Patrick'
						value={name}
						onChange={(e) => {setName(e.target.value)}}
						required={true}
						error={nameError}
						inputType={InputType.Basic}>
					</Input>
					<div className='mt-4'></div>
					<Input
						label='Email'
						placeholder='patrick@gmail.com'
						value={email}
						onChange={(e) => {setEmail(e.target.value)}}
						required={true}
						type='email'
						error={emailError}
						inputType={InputType.Basic}>
					</Input>
					<div className='mt-4'></div>
					<Textarea
						label='Message'
						placeholder='I woud like to contact you about...'
						value={message}
						onChange={(e) => {setMessage(e.target.value)}}
						required={true}
						error={messageError}
						textareaType={TextareaType.Basic}>
					</Textarea>
					<div className='mt-6'></div>
					<Button onClick={() => {}} loading={contactLoading}>
						Send Message
					</Button>
				</form>
			</Card>
		</div>
	</>
}