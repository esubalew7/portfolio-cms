import { useEffect, useRef, useState } from 'react';
import { connectPortfolio, disconnectPortfolio } from '../services/socket';

export default function useSocket() {
  const [status, setStatus] = useState('disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = connectPortfolio();
    socketRef.current = socket;

    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onReconnecting = () => setStatus('reconnecting');
    const onReconnect = () => setStatus('connected');
    const onError = () => setStatus('disconnected');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.io.on('reconnect_attempt', onReconnecting);
    socket.io.on('reconnect', onReconnect);
    socket.io.on('reconnect_error', onError);

    if (socket.connected) setStatus('connected');

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.io.off('reconnect_attempt', onReconnecting);
      socket.io.off('reconnect', onReconnect);
      socket.io.off('reconnect_error', onError);
      disconnectPortfolio();
    };
  }, []);

  return { socket: socketRef.current, status };
}
