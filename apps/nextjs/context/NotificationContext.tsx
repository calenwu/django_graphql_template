'use client'

import React, { createContext, use, useEffect, useState } from 'react';

type NotificationContextType = {
  counter: number,
  smallNotifications: SmallNotification[],
	addSmallNotification(smallNotification: SmallNotification): void ,
  removeSmallNotification(id: number): void,
  snackNotifications: SnackNotification[],
	addSnackNotification(
    title: string,
    text: string,
    type: SnackNotificationType,
    timeout?: number,
    id?: number,
    content?: React.ReactNode,
  ): void ,
  editSnackNotification(id: number, newText: string): void,
  removeSnackNotification(id: number): void,
  removeAllSnackNotification(): void,
  // setSmallNotifications(smallNotifications: SmallNotification[]): void,
}
export const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);


const NotificationProvider = ({ children }: any) => {
  const [smallNotifications, setSmallNotifications] = useState<SmallNotification[]>([]);
  const [snackNotifications, setSnackNotifications] = useState<SnackNotification[]>([]);
  const [counter, setCounter] = useState<number>(0);

  const increaseCounter = () => {
    setCounter(prevCounter => prevCounter + 1);
  }

  const addSmallNotification = (smallNotification: SmallNotification) => {
    setCounter(prevCounter => {
      smallNotification.id = smallNotification.id === -1 ? prevCounter + 1 : smallNotification.id;
      setSmallNotifications(prevNotifications => [...prevNotifications, smallNotification]);
      return prevCounter + 1;
    });
  };
  
  const removeSmallNotification = (id: number) => {
    setSmallNotifications(prevNotifications => [...prevNotifications].filter(item => item.id !== id));
  };

  const addSnackNotification = (
    title: string,
    text: string,
    type: SnackNotificationType,
    timeout?: number,
    id?: number,
    content?: React.ReactNode,
   ) => {
    const snackNotification = {
      id: id ? id : -1,
      text: text,
      title: title,
      timeout: timeout ? timeout : 5000,
      type: type,
      content: content,
    } as SnackNotification
    setCounter(prevCounter => {
      snackNotification.id = snackNotification.id === -1 ? prevCounter + 1 : snackNotification.id;
      setSnackNotifications(prevNotifications => [...prevNotifications, snackNotification]);
      return prevCounter + 1;
    });
  };
  
  const removeSnackNotification = (id: number) => {
    setSnackNotifications(prevNotifications => [...prevNotifications].filter(item => item.id !== id));
  };
  
  const removeAllSnackNotification = () => {
    setSnackNotifications([]);
  };
  
  const editSnackNotification = (id: number, newText: string) => {
    setSnackNotifications(prevNotifications => 
      prevNotifications.map(item => 
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  return (
    <NotificationContext.Provider value={{ counter, smallNotifications, addSmallNotification, removeSmallNotification,
      snackNotifications, addSnackNotification, editSnackNotification, removeSnackNotification, removeAllSnackNotification}}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

export interface SnackNotification {
  id: number;
  title: string;
  text: string;
  content?: React.ReactNode;
  timeout: number;
  type: SnackNotificationType;
}

export enum SnackNotificationType {
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Error = 'ERROR',
}

export interface SmallNotification {
  id: number;
  text: string;
  timeout: number;
}