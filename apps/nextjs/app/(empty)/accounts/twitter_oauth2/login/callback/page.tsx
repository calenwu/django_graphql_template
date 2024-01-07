'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { HOME } from '@/utils/routes';
import { TWITTER_CALLBACK, twitterCallbackProps } from '@/graphql/queries/accounts/index';
import { URL_PARAM_SHOW_SIGNIN_UP } from '@/utils/const';

export default function Page() {
	const router = useRouter()
  const searchParams = useSearchParams();
	const {
		loading: googleCallbackLoading,
		error: googleCallbackError,
		data: googleCallback} = useQuery<twitterCallbackProps>(
			TWITTER_CALLBACK,
		{
			variables: { '__uriExtra': '?' + searchParams.toString() },
			onCompleted: (data) => {
				console.log(data);
				if (data.twitterSignupCallback.email) {
					router.push(`/accounts/social/signup?email=${data.twitterSignupCallback.email}`);
				} else {
					if (data.twitterSignupCallback.token) {
						localStorage.setItem('token', data.twitterSignupCallback.token);
						localStorage.setItem('tokenExp', data.twitterSignupCallback.payload.exp.toString());
						localStorage.setItem('tokenRefreshExp', data.twitterSignupCallback.refreshExpiresIn.toString());
						router.push('/user/settings');
					} else {
						router.push('/accounts/confirm-email');
					}
				}
			},
			onError: (error) => {
				console.log(error)
				if (error.message === 'Social Network Login Failure') {
					console.log('Something went wrong. Please try login in again or contact our support.');
					router.push('/accounts/social/signup/error');
				} else {
					console.log(error.message);
				}
			}
		}
	);

	useEffect(() => {
		if (searchParams.get('error') === 'access_denied') {
			window.location.href=`${HOME}?${URL_PARAM_SHOW_SIGNIN_UP}=true`;
		}
	}, []);

  return <>
	</>
}
