'use client';
import { ChangeEventHandler, useId } from 'react';
import Label, { LabelType } from './label';

export enum TextareaType {
  Basic = 'Basic',
  Floating = 'Floating',
}

export default function Textarea({
	value,
	onChange, 
	label,
	placeholder=undefined,
	required=true,
	error='',
	disabled=false,
	readOnly=false,
	autoFocus=false,
	maxLength=undefined,
	minLength=undefined,
	rows=5,
	hidden=false,
	textareaType=TextareaType.Floating,
}: {
	value: string;
	onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
	label: string;
	placeholder?: string | undefined;
	disabled?: boolean;
	error?: string;
	required?: boolean;
	readOnly?: boolean;
	autoFocus?: boolean;
	maxLength?: number | undefined;
	minLength?: number | undefined;
	rows?: number | undefined;
	hidden?: boolean;
	textareaType?: TextareaType;
}) {
	const id = useId();
	let ret = null;
	if (textareaType === TextareaType.Floating) {
		ret = <div className={`form-label-group bg-white rounded`}>
			<textarea
				className={`rounded border w-full
					input-white-bg bg-transparent ${error ? 'border-error' : 'border-gray-300 focus:border-black'}
					p-3`
				}
				id={id}
				value={value}
				onChange={onChange}

				required={required}
				placeholder={placeholder ? placeholder : label}

				disabled={disabled}
				readOnly={readOnly}
				autoFocus={autoFocus}

				minLength={minLength}
				maxLength={maxLength}

				rows={rows}

				hidden={hidden}
			/>
			<Label htmlFor={id} value={label} labelType={LabelType.Floating}/>
		</div>
	} else {
		ret = <div>
			<Label htmlFor={id} value={label} labelType={LabelType.Basic}/>
			<textarea
				className={`rounded border w-full
					input-white-bg bg-transparent ${error ? 'border-error' : 'border-gray-300 focus:border-black'}
					p-3`
				}
				id={id}
				value={value}
				onChange={onChange}

				required={required}
				placeholder={placeholder ? placeholder : label}

				disabled={disabled}
				readOnly={readOnly}
				autoFocus={autoFocus}

				minLength={minLength}
				maxLength={maxLength}
				
				rows={rows}

				hidden={hidden}
			/>
		</div>
		}
	return <>
		{ ret }
		{ error ? 
			<div className='text-red-400 text-sm mt-2'>
				{error}
			</div>
			: null
		}
	</>;
}