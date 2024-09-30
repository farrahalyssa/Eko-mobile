const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config({ path: './.env' });
console.log({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT,
});

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Create the HTTP server and pass in the express app
const server = http.createServer(app);

// Initialize socket.io and bind it to the server
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const followRoutes = require('./routes/followRoutes');
const statsRoutes = require('./routes/statsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const notificationRoutes = require('./routes/notificationRoute');

// Use routes
app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(likeRoutes);
app.use(followRoutes);
app.use(statsRoutes);
app.use(searchRoutes);
app.use(messageRoutes);
app.use(chatRoomRoutes);
app.use(notificationRoutes);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // When a new notification is created, emit it to the client
  socket.on('new-notification', (notification) => {
    io.emit('notification', notification); // Send notification to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server (HTTP + WebSocket)
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
