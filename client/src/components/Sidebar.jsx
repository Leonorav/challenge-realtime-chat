import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveConversation, addConversation } from '../store/chatSlice';
import { logout } from '../store/authSlice';
import { createConversation } from '../services/apiService';
import { closeWebSocket } from '../services/websocketService';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');

  const handleSelectConversation = (conversation) => {
    dispatch(setActiveConversation(conversation));
  };

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    
    if (!newChatUsername.trim()) return;
    
    try {
      const newConversation = await createConversation([newChatUsername]);
      dispatch(addConversation(newConversation));
      dispatch(setActiveConversation(newConversation));
      setShowNewChat(false);
      setNewChatUsername('');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleLogout = () => {
    closeWebSocket();
    dispatch(logout());
  };

  return (
    <div className="w-64 bg-indigo-800 text-white flex flex-col">
      <div className="p-4 border-b border-indigo-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Chat App</h1>
          <button 
            onClick={handleLogout}
            className="text-indigo-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="mt-2 flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            {/* <p className="text-xs text-indigo-300">{user?.email || 'user@example.com'}</p> */}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={() => setShowNewChat(true)}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Chat
        </button>
      </div>
      
      {showNewChat && (
        <div className="p-4 border-t border-indigo-700">
          <form onSubmit={handleCreateConversation}>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full p-2 rounded-md bg-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newChatUsername}
              onChange={(e) => setNewChatUsername(e.target.value)}
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewChat(false)}
                className="px-3 py-1 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-md"
              >
                Start
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-2">Conversations</h2>
          <div className="space-y-1">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full text-left p-2 rounded-md flex items-center ${
                    activeConversation?.id === conversation.id
                      ? 'bg-indigo-700'
                      : 'hover:bg-indigo-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs">
                    {conversation.name?.charAt(0) || 'C'}
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <p className="text-sm font-medium truncate">{conversation.name || 'Chat'}</p>
                    {conversation.lastMessage && (
                      <p className="text-xs text-indigo-300 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-indigo-300">No conversations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 