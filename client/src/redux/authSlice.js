import { createSlice } from '@reduxjs/toolkit';
import supabase from '../services/supabaseService';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      // Sign out from Supabase
      supabase.auth.signOut();
      
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Check for existing session on app load
export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        // Create a user object with just the essential information
        const user = {
          id: userData.user.id,
          email: userData.user.email,
          name: userData.user.email.split('@')[0],
          username: userData.user.email.split('@')[0] 
        };
        
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailure(null)); 
      }
    } else {
      dispatch(loginFailure(null)); 
    }
  } catch (error) {
    dispatch(loginFailure(null)); 
  }
};

export default authSlice.reducer; 