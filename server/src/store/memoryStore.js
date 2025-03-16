// Here we created a class to store in-memory data
class MemoryStore {
  constructor() {
    this.messages = [];
    this.activeUsers = new Map();
  }

  // Below are the methods to get the messages and users data

  getMessages(limit = 50, offset = 0) {
    return this.messages.slice(offset, offset + limit);
  }

  addMessage(message) {
    this.messages.push(message);
    return message;
  }

  createMessage(content, user) {
    return {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      userId: user ? user.id : 'anonymous',
      userName: user ? user.name : 'Anonymous'
    };
  }


  addUser(socketId, userData) {
    const user = {
      id: userData.id || socketId,
      name: userData.name || 'Anonymous',
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.name || 'Anonymous'}&background=random`,
      status: 'online'
    };
    this.activeUsers.set(socketId, user);
    return user;
  }

  getUser(socketId) {
    return this.activeUsers.get(socketId);
  }

  removeUser(socketId) {
    const user = this.activeUsers.get(socketId);
    this.activeUsers.delete(socketId);
    return user;
  }

  getAllUsers() {
    return Array.from(this.activeUsers.values());
  }
}

module.exports = new MemoryStore(); 