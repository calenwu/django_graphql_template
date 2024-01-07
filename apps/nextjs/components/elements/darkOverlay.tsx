'use client';

export default function DarkOverlay({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='fixed inset-0 z-10
		bg-black bg-opacity-80'>
		<div className='relative flex justify-center items-center w-full h-full'>
			{children}
		</div>
	</div>
}
