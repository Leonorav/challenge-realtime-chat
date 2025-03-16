import io from 'socket.io-client';
import store from '../redux/store'; 

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  // Add the init method that's being called in App.js
  init() {
    console.log('Socket service initialized');
    return this;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
      
      this.socket.on('connect', () => {
        console.log('Socket connected');
        store.dispatch({ type: 'chat/setSocketConnected', payload: true });
        
        // Send user identification when connected
        const { auth } = store.getState();
        if (auth.user) {
          this.socket.emit('identify', {
            id: auth.user.id,
            name: auth.user.name,
            avatar: `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`
          });
        }
      });
      
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        store.dispatch({ type: 'chat/setSocketConnected', payload: false });
      });
      
      this.socket.on('chat message', (message) => {
        store.dispatch({ type: 'chat/receiveMessage', payload: message });
      });
      
      this.socket.on('users:updated', (users) => {
        console.log('Active users updated:', users);
        store.dispatch({ type: 'chat/setActiveUsers', payload: users });
      });
      
      this.socket.on('user:connected', (user) => {
        console.log('User connected:', user);
        store.dispatch({ type: 'chat/addActiveUser', payload: user });
      });
      
      this.socket.on('user:disconnected', (userId) => {
        console.log('User disconnected:', userId);
        store.dispatch({ type: 'chat/removeActiveUser', payload: userId });
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('chat message', message);
    }
  }

  // Send a JSON-RPC request
  sendJsonRpc(method, params = {}) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket is not connected'));
        return;
      }
      
      const id = this.jsonRpcId++;
      const request = {
        jsonrpc: '2.0',
        method,
        params,
        id
      };
      
      const responseHandler = (jsonString) => {
        try {
          const response = JSON.parse(jsonString);
          if (response.id === id) {
            this.socket.off('jsonrpc', responseHandler);
            
            if (response.error) {
              reject(new Error(response.error.message || 'JSON-RPC error'));
            } else {
              resolve(response.result);
            }
          }
        } catch (error) {
          reject(error);
        }
      };
      
      this.socket.on('jsonrpc', responseHandler);
      this.socket.emit('jsonrpc', JSON.stringify(request));
      
      setTimeout(() => {
        this.socket.off('jsonrpc', responseHandler);
        reject(new Error('JSON-RPC request timed out'));
      }, 10000);
    });
  }
  
  // Helper methods for common operations
  async getMessages() {
    try {
      const messages = await this.sendJsonRpc('getMessages');
      if (store && Array.isArray(messages)) {
        store.dispatch({ type: 'chat/setMessages', payload: messages });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }
}

const socketService = new SocketService();
export default socketService; 