import { createContext, useContext, useMemo } from 'react';
import useSocket from '../hooks/useSocket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketState = useSocket();

  const value = useMemo(() => socketState, [socketState.socket, socketState.status]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return ctx;
}
