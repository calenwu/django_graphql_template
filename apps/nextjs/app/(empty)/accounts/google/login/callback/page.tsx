'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GOOGLE_CALLBACK, googleCallbackProps } from '@/graphql/queries/accounts/index';
import { URL_PARAM_SHOW_SIGNIN_UP } from '@/utils/const';
import { HOME, SOCIAL_SIGNUP_ERROR } from '@/utils/routes';

export default function Page() {
	const router = useRouter()
  const searchParams = useSearchParams();
	const {
		loading: googleCallbackLoading,
		error: googleCallbackError,
		data: googleCallback} = useQuery<googleCallbackProps>(
			GOOGLE_CALLBACK,
			{
				variables: { '__uriExtra': '?' + searchParams.toString() },
				onCompleted: (data) => {
					console.log(data);
					if (data.googleSignupCallback.email) {
						router.push('/accounts/social/signup');
						localStorage.setItem('signupEmail', data.googleSignupCallback.email)
					} else {
						if (data.googleSignupCallback.token) {
							localStorage.setItem('token', data.googleSignupCallback.token);
							localStorage.setItem('tokenExp', data.googleSignupCallback.payload.exp.toString());
							localStorage.setItem('tokenRefreshExp', data.googleSignupCallback.refreshExpiresIn.toString());
							router.push('/user/settings');
						} else {
							router.push(data.googleSignupCallback.redirect);
						}
					}
				},
				onError: (error) => {
					console.log(error)
					if (error.message === 'Social Network Login Failure') {
						console.log('Something went wrong. Please try login in again or contact our support.');
						router.push(SOCIAL_SIGNUP_ERROR);
					} else {
						console.log(error.message);
					}
				}
			});

	useEffect(() => {
		if (searchParams.get('error') === 'access_denied') {
			window.location.href=`${HOME}?${URL_PARAM_SHOW_SIGNIN_UP}=true`;
		}
	}, []);

  return <>
		<h1>
			Redirecting
		</h1>
		<p>
			Please hold on while we redirect you ...
		</p>
		<img className='aspect-1-1 w-full animate-pulse' src='/imgs/redirect.webp' alt='redirect'/>
	</>
}
