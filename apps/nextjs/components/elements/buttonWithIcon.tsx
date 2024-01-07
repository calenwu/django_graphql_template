'use client';
import { MouseEventHandler } from 'react';

export default function ButtonWithIcon(
  { 
    children,
    onClick,
    src,
    loading=false,
    disabled=false,
  }: {
    children: React.ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>;
    src: string;
    loading?: boolean;
    disabled?: boolean;
  }
) {
  return <button className='relative button-primary button-md w-full' onClick={onClick}>
    <img className='absolute inset-y-1/2 -translate-y-1/2 left-2 w-4 h-4' src={src}/>
    {children}
  </button>
}
