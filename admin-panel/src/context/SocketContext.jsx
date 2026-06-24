import { createContext, useContext } from 'react';
import useSocket from '../hooks/useSocket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { socket, status, isConnected } = useSocket();

  return (
    <SocketContext.Provider value={{ socket, status, isConnected }}>
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
