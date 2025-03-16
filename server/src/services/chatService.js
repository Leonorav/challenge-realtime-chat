const store = require('../store/memoryStore');

class ChatService {
  getMessages({ limit = 50, offset = 0 }) {
    return store.getMessages(limit, offset);
  }

  sendMessage({ content, userId, userName }) {
    const message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      userId,
      userName
    };
    store.addMessage(message);
    return { success: true, message };
  }

  getActiveUsers() {
    return store.getAllUsers();
  }
}

module.exports = new ChatService(); 