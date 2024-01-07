import React, { useContext, useEffect, forwardRef } from 'react';
import {
	NotificationContext, 
	SnackNotification as SnackNotificationModel, 
	SnackNotificationType 
} from '@/context/NotificationContext';
import Svg from '../elements/svg';

interface SnackNotificationProps {
	snackNotification: SnackNotificationModel;
}

const SnackNotification = forwardRef<HTMLDivElement, SnackNotificationProps>(({snackNotification}, ref) => {
	const { removeSnackNotification } = useContext(NotificationContext);

	useEffect(() => {
		const timer = setTimeout(() => {
			removeSnackNotification(snackNotification.id);
		}, snackNotification.timeout);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	const innerText = () => {
		if (snackNotification.content) {
			return <>
				{ snackNotification.title ?
					<h2>{snackNotification.title}</h2>
					:
					null
				}
				{snackNotification.content}
			</>;
		}
		return <>
			{ snackNotification.title ? 
				<h2>{snackNotification.title}</h2>
				:
				null
			}
			{snackNotification.text}
		</>
	}

	const snackBar = () => {

		let borderColor = 'border-l-success';
		let textColor = 'text-success';
		let bgColor = 'bg-success';
		let icon = '/fontawesome/svgs/light/check-circle.svg';
		switch (snackNotification.type) {
			case(SnackNotificationType.Warning):
				borderColor = 'border-l-warning';
				textColor = 'text-warning';
				bgColor = 'bg-warning';
				icon = '/fontawesome/svgs/light/exclamation-circle.svg';
				break;
			case(SnackNotificationType.Error):
				borderColor = 'border-l-error';
				textColor = 'text-error';
				bgColor = 'bg-error';
				icon = '/fontawesome/svgs/light/exclamation-circle.svg';
				break;
		}

		return (
			<div id={snackNotification.id.toString()} ref={ref} className={`
				relative flex w-full border-l-4 shadow transition-opacity rounded
				bg-white ${borderColor} border-gray-100 border-t border-r border-b
				p-3 mb-4`}>
				<div className='flex items-center mr-2'>
					<Svg className={`w-5 h-5 ${bgColor}`} src={icon}/>
				</div>
				<div>
					<h4 className='font-bold mb-1'>
						{snackNotification.title}
					</h4>
					{snackNotification.content}
					{ !snackNotification.content ? 
						<p className='text-sm'>
							{snackNotification.text}
						</p>
						:
						null
					}
				</div>
			</div>
		);
	}

	return snackBar();
});

SnackNotification.displayName = 'SnackNotification';
export default SnackNotification;
