'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import { Button, ButtonSize, ButtonShape, DarkOverlay } from '@/components/elements/index';
import SignInUpForm from '@/components/user/signInUpForm';
import ForgotPasswordForm from '@/components/user/forgotPasswordForm';
import { URL_PARAM_SHOW_SIGNIN_UP } from '@/utils/const';

export default function Navbar() {
  const searchParams = useSearchParams();
  const showSignInUpPara = searchParams.get(URL_PARAM_SHOW_SIGNIN_UP) as string;
  const [showSignInUp, setShowSignInUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  useEffect(() => {
    if (showSignInUpPara === 'true') {
      setShowSignInUp(true);
    }
  }, []);

  return <>
  {(showSignInUp || showForgotPassword) &&
      <DarkOverlay>
        {/* {showSignUp &&
          <SignUpForm switchToSignIn={() => {
              setShowSignUp(false);
              setShowSignIn(true);
              setShowForgotPassword(false);
            }}
            close={() => {
              setShowSignUp(false);
              setShowSignIn(false);
              setShowForgotPassword(false);
            }}/>
        }
        {showSignIn && 
          <SignInForm switchToSignUp={() => {
              setShowSignUp(true);
              setShowSignIn(false);
              setShowForgotPassword(false);
            }}
            switchToForgotPassword={() => {
              setShowSignUp(false);
              setShowSignIn(false);
              setShowForgotPassword(true);
            }}
            close={() => {
              setShowSignUp(false);
              setShowSignIn(false);
              setShowForgotPassword(false);
            }}/>
        } */}
        {
          showSignInUp &&
          <SignInUpForm switchToForgotPassword={() => {
              setShowSignInUp(false);
              setShowForgotPassword(true);
            }}
            close={() => {
              setShowSignInUp(false);
              setShowForgotPassword(false);
            }}/>
        }
        { showForgotPassword &&
          <ForgotPasswordForm switchToSignIn={() => {
              setShowSignInUp(true);
              setShowForgotPassword(false);
            }}
            close={() => {
              setShowSignInUp(false);
              setShowForgotPassword(false);
            }}/>
        }
      </DarkOverlay>
    }
    <div className='border-b-2 border-black'>
      <div className='max-w-screen-xl flex justify-between items-center w-full
        text-black
        py-2 px-4 mx-auto'>
        <Link href='/'>
          <div className='text-xl'>
            Convodiary
          </div>
        </Link>
        <div className='flex items-center'>
          <Button onClick={() => {setShowSignInUp(true);}}
              buttonSize={ButtonSize.Small}
              buttonShape={ButtonShape.Round}
              className='parent-hover whitespace-nowrap'>
            Sign in
            <span className='ml-1.5 pb-0.5'>
              <span>
                <span className='small-hover-arrow-right-extension-line ml-2'/>
              </span>
              <span className='small-hover-arrow-right-extension-tip-container'>
                <span className='small-hover-arrow-right-extension-tip'/>
              </span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  </>;
}
