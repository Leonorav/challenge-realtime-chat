import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  activeConversation: null,
  conversations: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    fetchMessagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    fetchMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
  },
});

export const {
  setActiveConversation,
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  setConversations,
  addConversation,
} = chatSlice.actions;

export default chatSlice.reducer; 