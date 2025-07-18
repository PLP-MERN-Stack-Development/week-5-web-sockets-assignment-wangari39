const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    onlineUsers[socket.id] = username;
    io.emit('online-users', Object.values(onlineUsers));
  });

  socket.on('send-message', ({ sender, message }) => {
    const timestamp = new Date().toLocaleTimeString();
    io.emit('receive-message', { sender, message, timestamp });
  });

  socket.on('typing', (user) => {
    socket.broadcast.emit('user-typing', user);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('online-users', Object.values(onlineUsers));
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => res.send('Server is running'));
app.use(cors());

server.listen(5000, () => console.log('Server listening on port 5000'));
