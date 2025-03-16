import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './components/Login';
import Chat from './pages/Chat';
import { checkAuth } from './redux/authSlice';
import socketService from './services/socketService';
import './App.css';

// Initialize socket service with the Redux store
socketService.init(store);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    socketService.init();
    const { auth } = store.getState();
    if (auth.isAuthenticated) {
      socketService.connect();
    }
    return () => {
      socketService.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? <Chat /> : <Login />}
    </div>
  );
}

export default App;
