# Real-time Chat Application

A modern real-time chat application built with React, Socket.IO, and Redux, featuring JSON-RPC 2.0 for API communication. This project demonstrates real-time messaging capabilities with a clean, responsive UI built using Tailwind CSS.

![Screenshot 2025-03-17 180018](https://github.com/user-attachments/assets/0d449eff-8f13-4032-a779-0b561d41c681)
![Screenshot 2025-03-17 175931](https://github.com/user-attachments/assets/ecf9d78e-aa40-4788-bcf2-feb869df7a52)

## Features

- ⚡ Real-time messaging using Socket.IO
- 👥 Active users tracking with online/offline status
- 🔐 User authentication
- 💎 Premium features section
- 🎨 Modern UI with Tailwind CSS
- 🔄 Redux state management
- 📱 Fully responsive design

## Tech Stack

### Frontend (client)
- React.js
- Redux Toolkit for state management
- Socket.IO Client for real-time communication
- Tailwind CSS for styling
- JSON-RPC 2.0 for API calls

### Backend (server)
- Node.js
- Express
- Socket.IO
- JSON-RPC 2.0 Server

## Quick Start

### Running the Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on port 5000.

### Running the Frontend Client

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
cd /src
npm start
```

The client will start on port 3000.

## Environment Setup

### Backend (.env)
```env
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## API Methods

The application uses JSON-RPC 2.0 for API communication:

- `chat.getMessages` - Fetch chat history
- `chat.sendMessage` - Send a new message
- `chat.getActiveUsers` - Get list of active users
- `auth.login` - User authentication
- `auth.logout` - User logout

## Socket Events

- `connect` - Socket connection established
- `disconnect` - Socket disconnected
- `chat message` - New chat message
- `user:connected` - User joined
- `user:disconnected` - User left
- `users:updated` - Active users list updated

## Project Structure
