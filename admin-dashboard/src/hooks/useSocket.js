import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://portfolio-backend-gxhv.onrender.com');

export default function useSocket() {
  const [status, setStatus] = useState('disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setStatus('connected');
      socket.emit('join:admin');
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.io.on('reconnect_attempt', () => {
      setStatus('reconnecting');
    });

    socket.io.on('reconnect', () => {
      setStatus('connected');
      socket.emit('join:admin');
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      setStatus('disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, status, isConnected: status === 'connected' };
}
