'use client';
import './globals.css'
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
  return (
    <html lang='en'>
      <body className='font-poppins relative min-h-screen	bg-white'>
        <ApolloProvider>
          <NotificationProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </NotificationProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}