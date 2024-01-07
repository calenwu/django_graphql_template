'use client';
import { useContext, useRef } from 'react';
import { NotificationContext } from '@/context/NotificationContext';
import SnackNotification from '@/components/snackbar/snackNotification';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


export default function Navbar() {
  const { snackNotifications } = useContext(NotificationContext);
  const snackNotificationRef = useRef(null);

  return <div className='fixed top-20 left-1/2 -translate-x-1/2 z-20
      max-w-screen-xs sm:max-w-screen-sm md:max-w-screen-md w-full
      px-2'>
    <TransitionGroup className='flex flex-col-reverse relative'>   
        {snackNotifications.map((notification) => {
          return <CSSTransition key={notification.id} classNames='snack-notification' timeout={250}>
            <SnackNotification key={notification.id} ref={snackNotificationRef}  snackNotification={notification} />
          </CSSTransition>
        })}
    </TransitionGroup>
  </div>
}