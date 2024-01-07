'use client';
import { MouseEventHandler, useEffect } from 'react';
import { Svg } from '@/components/elements/index';
export default function CardOverlayContent({
	title,
	close,
	children,
}: {
	title: string,
	close: MouseEventHandler<HTMLButtonElement>,
	children: React.ReactNode
}) {
	useEffect(() => {

	}, []);

  return <div className='flex flex-col w-full rounded-t-lg rounded-b-none md:rounded-b-lg 
			md:relative
			absolute bottom-0 left-0 right-0 overflow-auto max-h-full
			transition-all animation-slidein-from-bottom
			bg-white'>
		<div className='relative flex justify-center items-center border-b
				p-4'>
			<h3 className='font-bold text-center'>
				{title}
			</h3>
			<button className='group absolute right-0 hover:bg-gray-200 rounded-full
					m-2 p-2'
					onClick={close}>
				<Svg className='w-4 h-4 bg-gray-400 group-hover:bg-black'
						src='/fontawesome/svgs/light/times.svg'/>
			</button>
		</div>
		<div className='flex flex-col
				p-4'>
			{children}
		</div>
	</div>
}
