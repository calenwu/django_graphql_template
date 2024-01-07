export default function Card({
		children,
	}: {
		children: React.ReactNode
	}) {
	return <div className='border shadow rounded
			border-gray-200
			px-4 py-8 md:p-12'>
		{children}
	</div>
}