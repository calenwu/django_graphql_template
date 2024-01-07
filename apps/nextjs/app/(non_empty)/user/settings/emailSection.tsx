
'use client';
import { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { USER_SETTINGS, emailaddress, userSettingsProps } from '@/graphql/queries/user';
import { CHANGE_EMAIL, DELETE_UNVERIFIED_EMAIL, changeEmailProps, deleteUnverifiedEmailProps } from '@/graphql/mutations/accounts';
import { Button, Input, InputType, Skeleton, Svg } from'@/components/elements';
import { Card } from'@/components/containers';
import { NotificationContext, SnackNotificationType } from '@/context/NotificationContext';
import { errorDictToString } from '@/utils/utils';


export default function Page () {
	const {addSnackNotification} = useContext(NotificationContext);

	const [email, setEmail] = useState<string>('');
	const [initialEmail, setInitialEmail] = useState<string>('');
	const [unverifiedEmails, setUnverifiedEmails] = useState<emailaddress[]>([]);
	const [emailError, setEmailError] = useState<string>('');

	const [userSettings, {loading: userSettingsLoading}] = useLazyQuery<userSettingsProps>(
		USER_SETTINGS,
		{
			fetchPolicy: 'no-cache',
			onCompleted: (data) => {
				setUnverifiedEmails(
					data.userSettings.emailaddressSet.filter((emailaddress: emailaddress) => {
						return !emailaddress.verified;
					})
				);
				data.userSettings.emailaddressSet.forEach((emailaddress: emailaddress) => {
					if (emailaddress.primary) {
						setEmail(emailaddress.email)
						setInitialEmail(emailaddress.email);
					}
				});
			},
			onError: (error) => {
				addSnackNotification(
					'Error while fetching user data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				);
			}
		});

	const [changeEmail, {loading: changeEmailLoading}] = useMutation<changeEmailProps>(
		CHANGE_EMAIL,
		{
			variables: {
				email: email,
			},
			onCompleted: (data) => {
				addSnackNotification(
					'Changed Email',
					'Before we change your email we need to confirm it. Please check your inbox (new email) for a confirmation email.',
					SnackNotificationType.Warning,
					undefined,
					undefined,
					undefined
				);
				userSettings();
			},
			onError: (error) => {
				console.log(error);
				console.log(errorDictToString('email', error));
				setEmailError(errorDictToString('email', error));
			}
		});
	
	const [ deleteUnverifiedEmail, {loading: deleteUnverifiedEmailLoading}] = useMutation<deleteUnverifiedEmailProps>(
		DELETE_UNVERIFIED_EMAIL);

	useEffect(() => {
		userSettings();
	}, []);

	function submitDeleteEmail (email: string) {
		deleteUnverifiedEmail({
			variables: {email: email},
			onCompleted: (data) => {
				userSettings();
				addSnackNotification(
					'Deleted Email',
					`You removed ${email} from your account.`,
					SnackNotificationType.Success,
					undefined,
					undefined,
					undefined
				);
			},
			onError: (error) => {
				console.log(error);
				addSnackNotification(
					'Error while fetching user data',
					error.message,
					SnackNotificationType.Error,
					undefined,
					undefined,
					undefined
				);
			}
		});
	}

	return <div>
		<Card>
			<h1 className='mb-2'>
				Email
			</h1>
			<p className='mb-4'>
				After changing your email you will first need to confirm it until then we will be using your old email.
				<br/>
				Once you confirmed your new email you will be able to login with it and your old one will be removed from this account.
			</p>
			<form onSubmit={(e) => {
					e.preventDefault();
					changeEmail();}
				}>
				{ userSettingsLoading ? 
					<Skeleton width='w-full'>
						<Input label='Email'
							placeholder='patrick@gmail.com'
							type='email'
							inputType={InputType.Basic}
							onChange={(e) => {
								setEmail(e.target.value);
								setEmailError('');
							}}
							value={email}/>
					</Skeleton>
					: 
					<Input label='Email'
						value={email}
						error={emailError}
						placeholder='patrick@gmail.com'
						inputType={InputType.Basic}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError('');
						}}/>
				}
				<div className='flex flex-row-reverse mt-8'>
					<Button className='max-w-xs' disabled={email === initialEmail}>
						Change Email
					</Button>
				</div>
			</form>
			{ unverifiedEmails.length > 0 ? <>
					<h2 className='mt-4 mb-2'>
						Unverified Emails
					</h2>
					<div className='flex flex-row flex-wrap mt-2'>
						{
							!userSettingsLoading ?
							unverifiedEmails.map((emailaddress: emailaddress) => {
								return <form key={emailaddress.email} onSubmit={(e) => {
									e.preventDefault();
									submitDeleteEmail(emailaddress.email);
								}}>
									<div key={emailaddress.email}
											className='flex flex-row rounded
													text-sm
													bg-primary-400 text-text-secondary-200
													p-1 mr-1 mb-1'>
										{emailaddress.email}
										<button className='ml-2'>
											<Svg src='/fontawesome/svgs/light/times.svg' className='w-3 h-3 bg-black'/>
										</button>
									</div>
								</form>
							})
							:
							<Skeleton width='w-auto' height='h-full' extra='rounded-lg'>
								<div className='flex flex-row rounded
											text-sm
											bg-primary-400
											text-text-secondary-200
											p-1 mr-1'>
									loading@gmail.com
									<button className='ml-2'>
										<Svg src='/fontawesome/svgs/light/times.svg' className='w-3 h-3 bg-black'/>
									</button>
								</div>		
							</Skeleton>
						}
					</div>
				</>
				:
				null
			}
		</Card>
	</div>
}