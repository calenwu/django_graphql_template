'use client';
import Snackbar from '@/components/snackbar/snackbar';
import { CONTACT, HOME } from '@/utils/routes';
import Card from '@/components/containers/card';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='min-h-screen relative 
      bg-gray-50'
    style={{
      // transform: 'skewY(-5deg)',
    }}>
    <div className='relative z-20'>
      <Snackbar/>
      <main className='max-w-screen-xl min-h-[600px] overflow-x-hidden
          p-4 lg:py-8 mx-auto mb-16'>
        <div className='max-w-screen-md 
            bg-gray-50
            md:px-4 lg:px-16 mx-auto'>
          <a href={HOME}>
            <div className='mt-8 mb-8 mx-auto'>
              Logo
            </div>
          </a>
          <div className='bg-white max-w-screen-md rounded mx-auto'>
            <Card>
              {children}
            </Card>
          </div>
          <div className='font-semibold
              text-gray-500
              mt-8'>
            <a className='link selectable font-semibold mr-2' href={HOME}>
              Home
            </a>
            <span>
              ·
            </span>
            <a className='link selectable font-semibold ml-2' href={CONTACT}>
              Contact
            </a>
          </div>
        </div>
      </main>
    </div>
    <div className='fixed h-8 top-[200px] md:top-[400px] w-full z-10 
        bg-primary-400'
      style={{
        transform: 'skewY(-10deg)',
      }}>
    </div>
  </div>
}
