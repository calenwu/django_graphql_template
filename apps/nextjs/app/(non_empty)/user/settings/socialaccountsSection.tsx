'use client';
import { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { USER_SETTINGS, socialaccount, userSettingsProps } from '@/graphql/queries/user';
import {
	GOOGLE_SINGUP_URL,
	googleSignupUrlProps,
	GOOGLE_CONNECT,
	googleConnectProps,
	TWITTER_CONNECT,
	twitterConnectProps,
	twitterSignupUrlProps,
	TWITTER_SIGNUP_URL
} from '@/graphql/queries/accounts';
import { Card } from'@/components/containers';
import { Button, CardOverlayContent, DarkOverlay, Skeleton, Svg } from'@/components/elements';
import { PROVIDER_GOOGLE, PROVIDER_TWITTER } from '@/utils/const';
import { ButtonColor } from '@/components/elements/button';
import { DISCONNECT_SOCIAL, disconnectSocialProps } from '@/graphql/mutations/accounts';
import { NotificationContext, SnackNotificationType } from '@/context/NotificationContext';


export default function Socialaccounts () {
	const {addSnackNotification} = useContext(NotificationContext);

	const [googleConnectUrlPara, setGoogleConnectUrlPara] = useState<string>('');
	const [twitterConnectUrlPara, setTwitterConnectUrlPara] = useState<string>('');
	const [socialaccounts, setSocialaccounts] = useState<socialaccount[]>([]);
	const [selectedSocialaccount, setSelectedSocialaccount] = useState<socialaccount | null>(null);

	const [userSettings, {loading: userSettingsLoading}] = useLazyQuery<userSettingsProps>(
		USER_SETTINGS,
		{
			fetchPolicy: 'no-cache',
			onCompleted: (data) => {
				if (data.userSettings.emailaddressSet) {
					setSocialaccounts(data.userSettings.socialaccountSet)
				}
			},
			onError: (error) => {
				addSnackNotification(
					'Error while fetching user data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		})

	const {} = useQuery<googleConnectProps>(
		GOOGLE_CONNECT,
		{
			onCompleted: (data) => {
				setGoogleConnectUrlPara(data.googleConnect.split('?')[1])
			},
			onError: (error) => {
				addSnackNotification(
					'Error while fetching data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		})
	
	const [googleConnect, {}] = useLazyQuery<googleSignupUrlProps>(
		GOOGLE_SINGUP_URL,
		{
			variables: { '__uriExtra': '?' + googleConnectUrlPara },
			onCompleted: (data) => {
				window.location.href = data.googleSignup;
				console.log(data);
			},
			onError: (error) => {
				addSnackNotification(
					'Error while fetching data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		})

	const {} = useQuery<twitterConnectProps>(
		TWITTER_CONNECT,
		{
			onCompleted: (data) => {
				setTwitterConnectUrlPara(data.twitterConnect.split('?')[1])
			},
			onError: (error) => {
				addSnackNotification(
					'Error while fetching data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		})
	
	const [twitterConnect, {}] = useLazyQuery<twitterSignupUrlProps>(
		TWITTER_SIGNUP_URL,
		{
			variables: { '__uriExtra': '?' + twitterConnectUrlPara },
			onCompleted: (data) => {
				window.location.href = data.twitterSignup;
			},
			onError: (error) => {
				addSnackNotification(
					'Error while fetching data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		})

	const [disconnectSocial, {loading: disconnectSocialLoading}] = useMutation<disconnectSocialProps>(
		DISCONNECT_SOCIAL,
		{
			variables: {
				'uid': selectedSocialaccount?.uid,
			},
			onCompleted: (data) => {
				addSnackNotification(
					'Disconnected account',
					'You succesfully disconnected your social account and can no longer sign it using that account.',
					SnackNotificationType.Success,
					undefined,
					undefined,
					undefined
				)
				userSettings();
				setSelectedSocialaccount(null);
			},
			onError: (error) => {
				addSnackNotification(
					'Could not disconnect social account',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				)
			}
		}
	)

	useEffect(() => {
		userSettings();
	}, []);

	function Socialaccount({
		social,
	} : {
		social: socialaccount,
	}) {
		if (social.provider === PROVIDER_TWITTER) {
			return <div className='relative flex justify-center items-center rounded-lg text-sm border
					text-white border-black
					p-4'
					style={{backgroundColor: '#1DA1F2'}}>
				<div className='flex items-center'>
					<Svg className='w-4 h-4 mr-2 bg-white' src='/fontawesome/svgs/brands/twitter.svg'/>
					{ social.email }
					<div className='absolute -top-3 -right-3 flex items-center justify-center w-6 h-6 p-2 rounded-full cursor-pointer
							border transition-colors
							border-black bg-red-500 hover:bg-red-300'
							onClick={() => setSelectedSocialaccount(social)}>
						<Svg className='w-5 h-5 bg-white' src='/fontawesome/svgs/light/times.svg'/>
					</div>
				</div>
			</div>
		}
		return <div className='relative flex justify-center items-center rounded-lg text-sm border
				bg-white text-black border-black
				p-4'>
			<div className='flex items-center'>
				<Svg className='w-4 h-4 mr-2 bg-black' src='/fontawesome/svgs/brands/google.svg'/>
				{ social.email }
				<div className='absolute -top-3 -right-3 flex items-center justify-center w-6 h-6 p-2 rounded-full cursor-pointer
						border transition-colors
						border-black bg-red-500 hover:bg-red-300'
						onClick={() => setSelectedSocialaccount(social)}>
					<Svg className='w-5 h-5 bg-white' src='/fontawesome/svgs/light/times.svg'/>
				</div>
			</div>
		</div>
	}

	return <>
		{
			selectedSocialaccount ? 
			<DarkOverlay>
				<div className='max-w-screen-sm w-full p-8'>
					<CardOverlayContent title='Disconnect account' close={() => setSelectedSocialaccount(null)}>
						<div className='mb-8'>
							Are you sure you want to disconnect your {selectedSocialaccount.provider} account {selectedSocialaccount?.email} from your account?
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<Button onClick={() => setSelectedSocialaccount(null)} buttonColor={ButtonColor.PrimaryOutline}>
								Cancel
							</Button>
							<Button onClick={() => {disconnectSocial();}}
									buttonColor={ButtonColor.Bad}
									loading={disconnectSocialLoading}>
								Disconnect
							</Button>
						</div>
					</CardOverlayContent>
				</div>
			</DarkOverlay>
			: null
		}
		<Card>
			<h1 className='mb-4'>
				Connected social accounts
			</h1>
			<p className='mb-4'>
				You can connect a social account so you can sign in with it.
			</p>
			<h2 className='mb-4'>
				Google
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
					mb-8'>
				{
					!userSettingsLoading?
					socialaccounts.filter((acc) => {return acc.provider == PROVIDER_GOOGLE}).map((acc) => {
						return <Socialaccount key={acc.uid} social={acc}/>
					})
					:
					null
				}
				{ userSettingsLoading ? 
					<>
						<Skeleton width='w-full' height='h-full' extra='rounded-lg'>
							<div className='flex justify-center items-center rounded-lg text-sm border border-dashed cursor-pointer
									transition-opacity opacity-40 hover:opacity-100
									bg-white text-black border-black
									p-4'
									onClick={() => googleConnect()}>
								<div className='flex items-center'>
									<Svg className='w-4 h-4 mr-2 bg-black' src='/fontawesome/svgs/brands/google.svg'/>
									Add Google
								</div>
							</div>
						</Skeleton>
					</>
					:
					<div className='flex justify-center items-center rounded-lg text-sm border border-dashed cursor-pointer
							transition-opacity opacity-40 hover:opacity-100
							bg-white text-black border-black
							p-4'
							onClick={() => googleConnect()}>
						<div className='flex items-center'>
							<Svg className='w-4 h-4 mr-2 bg-black' src='/fontawesome/svgs/brands/google.svg'/>
							Add Google
						</div>
					</div>
				}
			</div>
			<h2 className='mb-4'>
				Twitter
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{
					!userSettingsLoading?
					socialaccounts.filter((acc) => {return acc.provider == PROVIDER_TWITTER}).map((acc) => {
						return <Socialaccount key={acc.uid} social={acc}/>
					})
					:
					null
				}
				{ userSettingsLoading ? 
					<>
						<Skeleton width='w-full' height='h-full' extra='rounded-lg'>
							<div className='flex justify-center items-center rounded-lg text-sm border border-dashed cursor-pointer
									transition-opacity opacity-40 hover:opacity-100
									text-white border-black
									p-4'
									style={{backgroundColor: '#1DA1F2'}}
									onClick={() => twitterConnect()}>
								<div className='flex items-center'>
									<Svg className='w-4 h-4 mr-2 bg-white' src='/fontawesome/svgs/brands/twitter.svg'/>
									Add Twitter
								</div>
							</div>
						</Skeleton>
					</>
					:
					<div className='flex justify-center items-center rounded-lg text-sm border border-dashed cursor-pointer
							transition-opacity opacity-40 hover:opacity-100
							text-white border-black
							p-4'
							style={{backgroundColor: '#1DA1F2'}}
							onClick={() => twitterConnect()}>
						<div className='flex items-center'>
							<Svg className='w-4 h-4 mr-2 bg-white' src='/fontawesome/svgs/brands/twitter.svg'/>
							Add Twitter
						</div>
					</div>
				}
			</div>
		</Card>
	</>
}