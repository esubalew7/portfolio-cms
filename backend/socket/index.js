import { Server } from 'socket.io';
import { joinAdminRoom, joinPortfolioRoom, leaveAllRooms } from './rooms.js';

let io;

export function setupSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        const allowedOrigins = [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://localhost:3000',
          'https://portfolio-mern-one-rho.vercel.app',
          "https://portfolio-mern-bicw.vercel.app"
        ];
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join:admin', () => {
      joinAdminRoom(socket);
      console.log(`[Socket] ${socket.id} joined admin room`);
    });

    socket.on('join:portfolio', () => {
      joinPortfolioRoom(socket);
      console.log(`[Socket] ${socket.id} joined portfolio room`);
    });

    socket.on('disconnect', (reason) => {
      leaveAllRooms(socket);
      console.log(`[Socket] Client disconnected: ${socket.id} — ${reason}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
