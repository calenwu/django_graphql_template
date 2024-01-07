'use client';

export enum LabelType {
  Basic = 'Basic',
  Floating = 'Floating',
}

export default function Label({
	htmlFor,
	value, 
	labelType=LabelType.Basic,
}: {
	htmlFor: string,
	value: string,
	labelType?: LabelType,
}) {
	if (labelType === LabelType.Floating) {
		return <label htmlFor={htmlFor}
			className='block absolute top-0.5 left-0 rounded transition-all select-none cursor-text
					text-gray-400
					p-3 mb-0'>
			{value}
		</label>
	} else {
		return <label htmlFor={htmlFor}
			className='block
				mb-1'>
			{value}
		</label>
	}
	return 
}