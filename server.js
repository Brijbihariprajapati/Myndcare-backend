require('dotenv').config()
const express = require('express')
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./Models/messageSchema'); 

const cors = require('cors')
const path = require('path')

const bodyParser = require('body-parser');

const dbconnect = require('./utils/db')
const App = express()
App.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));

App.use("/public", express.static(path.join(__dirname, "public")));

const router = require('./Router/auth-router')
App.use(bodyParser.urlencoded({ extended: true }));
App.use(cors())
App.use(bodyParser.json());


App.use('/api/auth',router)

App.use(express.json())


const server = http.createServer(App);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

let users = {};

io.on('connection', (socket) => {
  const senderEmail = socket.handshake.query.email || 'Anonymous';
  const senderName = socket.handshake.query.name || 'Anonymous';
  
  console.log('User connected:', socket.id, senderEmail);
  
  users[socket.id] = { id: socket.id, email: senderEmail,names:senderName };
  
  io.emit('userList', Object.values(users));

  socket.on('sendPrivateMessage', async ({ message, recipientId, recipientEmail, senderEmail,senderName,Date }) => {
    console.log(`Message from ${senderEmail} to ${recipientEmail}`);
    
    await Message.create({ message, recipientEmail, senderEmail,name:senderName ,Date});
    
    io.to(recipientId).emit('receiveChatMessage', { message, id: socket.id, recipientEmail, senderEmail, name:senderName,Date});
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    delete users[socket.id];
    
    io.emit('userList', Object.values(users));
  });
});

App.listen(7000,()=>{
    console.log('server started on port no 7000')
})