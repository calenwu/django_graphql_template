'use client';

export default function Svg(
  { 
		src,
    className='',
  }: {
		src: string,
    className?: string,
  }
) {
  return <div className={`${className}`} style={{
		maskSize: '100%',
		maskRepeat: 'no-repeat',
		maskPosition: 'center',
		WebkitMaskRepeat: 'no-repeat',
		maskImage: `url(${src})`,
		WebkitMaskImage: `url(${src})`,
	}}/>
}
