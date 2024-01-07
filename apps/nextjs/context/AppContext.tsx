'use client';
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, Dispatch, SetStateAction, useMemo } from 'react';

type AppContextType = {
}
interface AppProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	return (
		<AppContext.Provider value={{}}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;