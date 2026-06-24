import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://portfolio-backend-gxhv.onrender.com');

let socket = null;
let listeners = 0;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

export function connectPortfolio() {
  const s = getSocket();
  listeners++;
  s.emit('join:portfolio');
  return s;
}

export function disconnectPortfolio() {
  listeners--;
  if (listeners <= 0 && socket) {
    socket.emit('leave:portfolio');
  }
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    listeners = 0;
  }
}
