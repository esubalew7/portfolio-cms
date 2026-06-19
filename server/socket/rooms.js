export const ROOMS = {
  ADMIN: 'admin',
  PORTFOLIO: 'portfolio',
};

export function joinAdminRoom(socket) {
  socket.join(ROOMS.ADMIN);
}

export function joinPortfolioRoom(socket) {
  socket.join(ROOMS.PORTFOLIO);
}

export function leaveAllRooms(socket) {
  socket.leave(ROOMS.ADMIN);
  socket.leave(ROOMS.PORTFOLIO);
}
