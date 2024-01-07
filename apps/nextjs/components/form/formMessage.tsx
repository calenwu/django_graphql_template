'use client';
import Svg from '@/components/elements/svg';

export enum MessageType {
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error',
}
export default function FormMessage(
  { 
    children,
    title,
    messageType,
  }: {
    children: React.ReactNode,
    title: string,
    messageType: MessageType
  }
) {
  let borderColor = 'border-l-success';
  let textColor = 'text-success';
  let bgColor = 'bg-success';
  let icon = '/fontawesome/svgs/light/check-circle.svg';
  switch (messageType) {
    case(MessageType.Warning):
      borderColor = 'border-l-warning';
      textColor = 'text-warning';
      bgColor = 'bg-warning';
      icon = '/fontawesome/svgs/light/exclamation-circle.svg';
      break;
    case(MessageType.Error):
      borderColor = 'border-l-error';
      textColor = 'text-error';
      bgColor = 'bg-error';
      icon = '/fontawesome/svgs/light/exclamation-circle.svg';
      break;
  }
  return <div className={`
    relative flex w-full border-l-4 shadow transition-opacity rounded
    bg-white ${borderColor} border-gray-100 border-t border-r border-b
    p-3 mb-4`}>
    <div className='flex items-center mr-2'>
      <Svg className={`w-5 h-5 ${bgColor}`} src={icon}/>
    </div>
    <div>
      <h4 className='font-bold mb-1'>
        {title}
      </h4>
      <p className='text-sm'>
        {children}        
      </p>
    </div>
  </div>
}
