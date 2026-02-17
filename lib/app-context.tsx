'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, SystemStatus } from './types';
import { appReducer, AppAction, initialState } from './app-reducer';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateSystemStatus: (status: Partial<SystemStatus>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const updateSystemStatus = async (status: Partial<SystemStatus>) => {
    try {

      dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: status });

      const response = await fetch('http://localhost:8053/system/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        console.error('Failed to update system status');

      }


      const data = await response.json();
      if (data.systemStatus) {
        dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: data.systemStatus });
      }

    } catch (error) {
      console.error('Error updating system status:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, updateSystemStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
