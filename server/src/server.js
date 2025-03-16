const express = require('express');
const http = require('http');
const cors = require('cors');
const jsonRpcServer = require('./routes/jsonrpc');
const setupSocket = require('./config/socket');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//  middleware to parse JSON bodies
app.use(express.json());

// HTTP endpoint for JSON-RPC
app.post('/', async (req, res) => {
  const jsonResponse = await jsonRpcServer.receive(req.body);
  if (jsonResponse) {
    res.json(jsonResponse);
  } else {
    res.status(204).end();
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});