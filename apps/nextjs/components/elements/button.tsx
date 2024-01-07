'use client';
import { MouseEventHandler } from 'react';

export enum ButtonColor {
  Black = 'Black',
  Gray = 'Gray',
  White = 'White',
  BlackOutline = 'BlackOutline',
  GrayOutline = 'GrayOutline',

  Primary = 'Primiary',
  Secondary = 'Secondary',
  Tetritary = 'Tetritary',
  Quaternary = 'Quaternary',
  PrimaryOutline = 'PrimaryOutline',
  SecondaryOutline = 'SecondaryOutline',
  TetritaryOutline = 'TetritaryOutline',
  QuaternaryOutline = 'QuaternaryOutline',

  Good = 'Good',
  Neutral = 'Neutral',
  Bad = 'Bad',
  GoodOutline = 'GoodOutline',
  NeutralOutline = 'NeutralOutline',
  BadOutline = 'BadOutline',
}

export enum ButtonShape {
  Square = 'Square',
  Round = 'Round',
}

export enum ButtonSize {
  XSmall = 'XSmall',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  XLarge = 'XLarge',
}

export default function Button(
  { 
    children,
    onClick,
    buttonColor=ButtonColor.Primary,
    buttonShape=ButtonShape.Square,
    buttonSize=ButtonSize.Medium,
    loading=false,
    disabled=false,
    className='',
  }: {
    children: React.ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>;
    buttonColor?: ButtonColor,
    buttonShape?: ButtonShape,
    buttonSize?: ButtonSize,
    loading?: boolean,
    disabled?: boolean,
    className?: string,
  }
) {
  let btnColorClass = 'button-primary';
  switch (buttonColor) {
    case(ButtonColor.Black):
      btnColorClass = 'bg-black text-white';
      break;
    case(ButtonColor.Gray):
      btnColorClass = 'bg-gray-500 text-white';
      break;
    case(ButtonColor.White):
      btnColorClass = 'bg-white text-black';
      break;
    case(ButtonColor.BlackOutline):
      btnColorClass = 'bg-white text-black border-black';
      break;
    case(ButtonColor.GrayOutline):
      btnColorClass = 'bg-white text-gray-500 border-gray-500';
      break;

    case(ButtonColor.Primary):
      btnColorClass = 'button-primary';
      break;
    case(ButtonColor.PrimaryOutline):
      btnColorClass = 'button-primary-outline';
      break;
    case(ButtonColor.Secondary):
      btnColorClass = 'button-secondary';
      break;
    
    case(ButtonColor.Bad):
      btnColorClass = 'bg-red-500 text-white hover:bg-red-300';
      break;
  }
  let btnShapeClass = 'rounded-lg';
  switch (buttonShape) {
    case(ButtonShape.Square):
      btnShapeClass = 'rounded-lg';
      break;
    case(ButtonShape.Round):
      btnShapeClass = 'rounded-full';
      break;
  }
  let btnSizeClass = 'button-md';
  switch (buttonSize) {
    case(ButtonSize.XSmall):
      btnSizeClass = 'button-xs';
      break;
    case(ButtonSize.Small):
      btnSizeClass = 'button-sm';
      break;
    case(ButtonSize.Medium):
      btnSizeClass = 'button-md';
      break;
    case(ButtonSize.Large):
      btnSizeClass = 'button-lg';
      break;
    case(ButtonSize.XLarge):
      btnSizeClass = 'button-xl';
      break;
  }

  return <button className={`flex items-center justify-center
      relative w-full ${btnColorClass} ${btnSizeClass} ${btnShapeClass} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}>
    { loading ? 
      <div className='flex items-center justify-center space-x-2 animate-pulse'>
        <div className='w-8 h-8 bg-red-400 rounded-full'></div>
        <div className='w-8 h-8 bg-red-400 rounded-full'></div>
        <div className='w-8 h-8 bg-red-400 rounded-full'></div>
      </div>
      :
      children
    }
  </button>
}
