const { Server } = require('socket.io');
const setupSocketEvents = require('../events/socketEvents');

// Here we setup the socket server including configs
function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST'],
    },
  });

  // Here we print every connection event5
  io.on('connection', (socket) => {
    console.log('A user connected');
    setupSocketEvents(io, socket);
  });

  return io;
}

module.exports = setupSocket; 