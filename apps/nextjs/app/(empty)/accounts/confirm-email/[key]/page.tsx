'use client';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client'
import { CONFIRM_EMAIL, confirmEmailProps } from '@/graphql/mutations/accounts/confirmEmail';
import { Button, Skeleton } from '@/components/elements';
import { HOME, USER_SETTINGS } from '@/utils/routes';
import { URL_PARAM_SHOW_SIGNIN_UP } from '@/utils/const';

export default function Page({ params }: { params: { key: string } }) {
	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [confirm_email, {data}] = useMutation<confirmEmailProps>(CONFIRM_EMAIL, {
		variables: {
			'key': decodeURIComponent(params.key),
		},
		onCompleted: (data) => {
			setSuccess(true);
			window.location.href = USER_SETTINGS;
		},
		onError: (error) => {
			setError(true);
		}
	});

	useEffect(() => {
		confirm_email();
	}, []);

	if (success) {
		return <div>
			<h1 className='mb-4'>
				Yayyyy
			</h1>
			<p className='mb-4'>
				Your email is confirmed.
				<br/>
				We are redirecting you to your profile page, please wait.
			</p>
			<img className='w-full animate-pulse' src='/imgs/email_confirmed.webp'/>
		</div>
	} else if (error) {
		return <div>
			<h1 className='mb-4'>
				Error
			</h1>
			<p className='mb-4'>
				Your email could not be confirmed.
				<br/>
				The link is invalid or has expired. Please login again.
			</p>
			<img className='w-full mb-6' src='/imgs/broken_link.webp'/>
			<Button onClick={() => {window.location.href = `${HOME}?${URL_PARAM_SHOW_SIGNIN_UP}=true`}}>
				Log in
			</Button>
		</div>
	}
  return <div>
		<Skeleton extra='mb-4'>
			<h1>
				Error
			</h1>
		</Skeleton>
		<Skeleton extra='mb-1'>
			<p>
				Your email could not be confirmed.
			</p>
		</Skeleton>
		<Skeleton extra='mb-4'>
			<p>
				The link is invalid or has expired. Please login again.
			</p>
		</Skeleton>
		<Skeleton width='w-full' height='h-full' extra='aspect-square'>
		</Skeleton>
	</div>
}