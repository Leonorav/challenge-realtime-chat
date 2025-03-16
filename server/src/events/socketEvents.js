const store = require('../store/memoryStore');

// Here we handle all the socket events
function setupSocketEvents(io, socket) {
  socket.on('identify', (userData) => {
    const user = store.addUser(socket.id, userData);
    io.emit('user:connected', user);
    io.emit('users:updated', store.getAllUsers());
  });

  socket.on('chat message', (msg) => {
    const message = store.addMessage(msg);
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    const user = store.removeUser(socket.id);
    if (user) {
      io.emit('user:disconnected', user.id);
      io.emit('users:updated', store.getAllUsers());
    }
  });

  // Listen to jsonrpc requests
  socket.on('jsonrpc', async (jsonString) => {
    const jsonRequest = JSON.parse(jsonString);
    const jsonResponse = await jsonRpcServer.receive(jsonRequest);
    if (jsonResponse) {
      socket.emit('jsonrpc', JSON.stringify(jsonResponse));
    }
  });
}

module.exports = setupSocketEvents; 