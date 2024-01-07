'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Card } from '@/components/containers';
import { Input, Button } from '@/components/elements';

export default function PasswordSection () {
	const [password1, setPassword1] = useState<string>('');
	const [password1Error, setPassword1Error] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const [password2Error, setPassword2Error] = useState<string>('');

	return <div>
		<Card>
			<h1 className='mb-2'>
				Connected social accounts
			</h1>
			<p>
				Here are you connected social accounts
			</p>
			<form className=''>
				<Button onClick={() => {}}>
					Change password
				</Button>

			</form>
		</Card>
	</div>
}