const { JSONRPCServer } = require('json-rpc-2.0');
const chatService = require('../services/chatService');


const jsonRpcServer = new JSONRPCServer();

// Register chat methods
jsonRpcServer.addMethod('chat.getMessages', chatService.getMessages.bind(chatService));
jsonRpcServer.addMethod('chat.sendMessage', chatService.sendMessage.bind(chatService));
jsonRpcServer.addMethod('chat.getActiveUsers', chatService.getActiveUsers.bind(chatService));

module.exports = jsonRpcServer; 