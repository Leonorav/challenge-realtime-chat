import socketService from './socketService';

export const loginUser = async (username, password) => {
  return socketService.sendJsonRpc('auth.login', { username, password });
};

export const fetchConversations = async () => {
  return socketService.sendJsonRpc('chat.getConversations', {});
};

export const fetchMessages = async (conversationId) => {
  return socketService.sendJsonRpc('chat.getMessages', { conversationId });
};

export const sendMessage = async (conversationId, content) => {
  return socketService.sendJsonRpc('chat.sendMessage', { conversationId, content });
};

export const createConversation = async (participants) => {
  return socketService.sendJsonRpc('chat.createConversation', { participants });
}; 