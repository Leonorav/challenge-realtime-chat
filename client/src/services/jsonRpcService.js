class JsonRpcService {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.id = 1;
  }

  async call(method, params = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: this.id++,
        }),

      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'JSON-RPC error');
      }
      
      return data.result;
    } catch (error) {
      console.error('JSON-RPC error:', error);
      throw error;
    }
  }
  
  // Chat methods
  async getMessages(limit = 50, offset = 0) {
    return this.call('chat.getMessages', { limit, offset });
  }
  
  async sendMessage(content) {
    return this.call('chat.sendMessage', { content });
  }
  
  async getActiveUsers() {
    return this.call('chat.getActiveUsers');
  }
}

export default new JsonRpcService(); 