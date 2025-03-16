import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Diamond3D from '../components/Diamond3D';
import socketService from '../services/socketService';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages = [], activeUsers = [], socketConnected, loading } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Instead, just fetch active users once when the component mounts
  useEffect(() => {
    // Connect to socket if not already connected
    socketService.connect();
    
    // Fetch active users once initially
    const fetchUsers = async () => {
      try {
        console.log('Initially fetching active users via JSON-RPC...');
        
        const jsonRpcRequest = {
          jsonrpc: "2.0",
          method: "chat.getActiveUsers",
          params: {},
          id: 1
        };
        
        const serverUrl = 'http://localhost:5000/';
        
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonRpcRequest)
        });
        
        const data = await response.json();
        console.log('Initial JSON-RPC response for active users:', data);
        
        if (data && data.result) {
          dispatch({ type: 'chat/setActiveUsers', payload: data.result });
        }
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };
    
    fetchUsers();
    
    return () => {
      socketService.disconnect();
    };
  }, [dispatch, user]);

  // Remove the dummy users and just use the actual data from the server
  const safeActiveUsers = Array.isArray(activeUsers) ? activeUsers : [];
  

  // Initialize socket connection when component mounts
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Create message object
      const message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: {
          id: user.id,
          name: user.name,
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
        },
        timestamp: new Date().toISOString()
      };
      
      // Send via Socket.io using socketService
      socketService.sendMessage(message);
      
      // Clear input
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
              <span className="text-sm text-gray-500">{socketConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
              alt={user?.name || 'User'} 
              className="h-10 w-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{user?.name || 'User'}</p>
              {/* <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p> */}
            </div>
            <button 
              onClick={handleLogout}
              className="ml-auto text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Active Users</h3>
          {safeActiveUsers.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">Loading users...</p>
          ) : (
            <ul>
              {safeActiveUsers.map((user) => (
                <li key={user.id} className="flex items-center py-2">
                  <div className="relative">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                      }}
                    />
                    <span 
                      className={`absolute bottom-0 right-2 h-3 w-3 rounded-full border-2 border-white ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></span>
                  </div>
                  <span className="font-medium">{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Premium Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-center text-white shadow-lg">
            <Diamond3D />
            <h3 className="font-bold text-lg mt-2">Get Premium</h3>
            <p className="text-xs mt-1 text-blue-100">Unlock advanced features</p>
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold">Group Chat</h2>
          <p className="text-sm text-gray-500">
            {safeActiveUsers.filter(u => u.status === 'online').length} online
          </p>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading && (!messages || messages.length === 0) ? (
            <div className="flex justify-center items-center h-full">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (!messages || messages.length === 0) ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender.id !== user.id && (
                  <img 
                    src={message.sender.avatar} 
                    alt={message.sender.name} 
                    className="h-8 w-8 rounded-full mr-2 self-end"
                  />
                )}
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender.id === user.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.sender.id !== user.id && (
                    <p className="font-semibold text-sm">{message.sender.name}</p>
                  )}
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 text-right ${
                    message.sender.id === user.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 