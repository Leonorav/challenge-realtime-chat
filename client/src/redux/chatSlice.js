import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jsonRpcService from '../services/jsonRpcService';
import socketService from '../services/socketService';

// Sample chat data for fallback
const initialMessages = [
  {
    id: '1',
    sender: { id: '2', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
    content: 'Hey there! How are you doing today?',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    sender: { id: '3', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    content: 'I just finished the project we were working on!',
    timestamp: new Date(Date.now() - 2400000).toISOString()
  },
  {
    id: '3',
    sender: { id: '1', name: 'Demo User', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' },
    content: 'That sounds great! Can you share the details?',
    timestamp: new Date(Date.now() - 1200000).toISOString()
  },
  {
    id: '4',
    sender: { id: '2', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
    content: "Sure! I'll send you the documentation later today.",
    timestamp: new Date(Date.now() - 600000).toISOString()
  }
];


export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ limit = 50, offset = 0 }, { rejectWithValue }) => {
    try {
      const messages = await jsonRpcService.getMessages(limit, offset);
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return initialMessages;
    }
  }
);

export const sendMessageToServer = createAsyncThunk(
  'chat/sendMessageToServer',
  async (content, { getState }) => {
    const { auth } = getState();
    const user = auth.user;
    
    // Create message object
    const message = {
      id: Date.now().toString(),
      content,
      sender: {
        id: user.id,
        name: user.name,
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' 
      },
      timestamp: new Date().toISOString()
    };
    
    // Send via Socket.io
    socketService.sendMessage(message);
    
    return message;
  }
);

export const fetchActiveUsers = createAsyncThunk(
  'chat/fetchActiveUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Create a JSON-RPC request
      const jsonRpcRequest = {
        jsonrpc: "2.0",
        method: "chat.getActiveUsers",
        params: {},
        id: 1
      };
      
      // Send the request to the server
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonRpcRequest)
      });
      
      const data = await response.json();
      
      // Check if we have a valid response
      if (data && data.result) {
        const activeUserCount = data.result.count || 0;
        
        // Create an array of active users (with the current user)
        const activeUsersList = [
          {
            id: auth.user.id,
            name: auth.user.name,
            avatar: `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`,
            status: 'online'
          }
        ];
        
        // Add some placeholder users if there are more connections
        for (let i = 1; i < activeUserCount; i++) {
          activeUsersList.push({
            id: `user-${i}`,
            name: `User ${i}`,
            avatar: `https://ui-avatars.com/api/?name=User+${i}&background=random`,
            status: 'online'
          });
        }
        
        return activeUsersList;
      }
      
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    activeUsers: [],
    socketConnected: false,
    loading: false,
    error: null
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    addActiveUser: (state, action) => {
      // Check if user already exists to avoid duplicates
      const exists = state.activeUsers.some(user => user.id === action.payload.id);
      if (!exists) {
        state.activeUsers.push(action.payload);
      }
    },
    removeActiveUser: (state, action) => {
      state.activeUsers = state.activeUsers.filter(user => user.id !== action.payload);
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessageToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageToServer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendMessageToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch active users
      .addCase(fetchActiveUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUsers = action.payload;
      })
      .addCase(fetchActiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setSocketConnected, 
  setActiveUsers, 
  addActiveUser, 
  removeActiveUser, 
  receiveMessage, 
  setMessages, 
  clearError 
} = chatSlice.actions;

export default chatSlice.reducer; 