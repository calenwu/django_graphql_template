'use client';

export default function Skeleton(
  { 
    width='w-auto',
    height='h-auto',
    extra='',
    children,
  }: {
    width?: string,
    height?: string,
    extra?: string,
    children?: React.ReactNode,
  }
) {
  return <div>
    <div className={`inline-block ${width} ${height} rounded animate-pulse
        bg-gray-300
        ${extra}`}>
      <div className='invisible'>
        { children }
      </div>
    </div>
  </div>
}
