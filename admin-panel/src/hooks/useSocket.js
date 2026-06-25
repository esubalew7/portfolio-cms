import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://portfolio-backend-gxhv.onrender.com');

export default function useSocket() {
  const [status, setStatus] = useState('disconnected');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    s.on('connect', () => {
      setStatus('connected');
      s.emit('join:admin');
    });

    s.on('disconnect', () => {
      setStatus('disconnected');
    });

    s.io.on('reconnect_attempt', () => {
      setStatus('reconnecting');
    });

    s.io.on('reconnect', () => {
      setStatus('connected');
      s.emit('join:admin');
    });

    s.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      setStatus('disconnected');
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return { socket, status, isConnected: status === 'connected' };
}
