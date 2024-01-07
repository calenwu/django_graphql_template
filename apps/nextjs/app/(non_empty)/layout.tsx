'use client';
import '../globals.css'
import Link from 'next/link';
import Navbar from '@/components/navbar';
import AppProvider from '@/context/AppContext';
import NotificationProvider from '@/context/NotificationContext';
import { ApolloProvider } from '@/graphql/apolloProvider';
import Snackbar from '@/components/snackbar/snackbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>
    <Navbar/>
    <Snackbar/>
    <main className='max-w-screen-xl min-h-[600px] overflow-x-hidden
        p-4 lg:py-8 mx-auto mb-16'>
      {children}
    </main>
    <footer className='border-t-2 border-black'>
      <div className='max-w-screen-xl flex flex-row flex-wrap mx-auto p-4'>
        <Link href='/cookies' 
          className='font-bold transition-colors
              hover:text-gray-500 
              mr-4 mb-4'>
          Cookies
        </Link>
        <Link href='/terms-of-service'
          className='font-bold transition-colors 
              hover:text-gray-500
              mr-4 mb-4'>
          T&S
        </Link>
        <Link href='/privacy-policy' 
          className='font-bold transition-colors hover:text-gray-500 mr-2 mb-4'>
          Privacy Policy
        </Link>
      </div>
    </footer>
  </>
}