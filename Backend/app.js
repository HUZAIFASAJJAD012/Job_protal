import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Import routes
import user from './routes/user.js';
import school from './routes/school.js';
import authentication from './routes/authentication.js';
import paymentRoutes from './routes/payment.js';
import Rating from './routes/rating.js';
import conversations from './routes/conversations.js';
import messages from './routes/messages.js';

// Import models
import Chat from './models/Chat.js';
import Message from './models/Message.js';

// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || '8000';

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.db2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, '../Frontend/build');

// Stripe webhook route (must use raw body)

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL.split(',');
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }));

// JSON and static middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(buildPath));

// API routes
app.use('/api/payment', paymentRoutes);
app.use('/user', user);
app.use('/school', school);
app.use('/auth', authentication);
app.use('/rating', Rating);
app.use('/conversations', conversations);
app.use('/messages', messages);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  });
});

// Create server and Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('send_message', async ({ sender, receiver, content }) => {
    try {
      let chat = await Chat.findOne({ members: { $all: [sender, receiver] } });

      if (!chat) {
        chat = new Chat({ members: [sender, receiver] });
        await chat.save();
      }

      const newMessage = new Message({
        chatId: chat._id,
        sender,
        content
      });

      await newMessage.save();

      io.to(receiver).emit('receive_message', newMessage);
      io.to(sender).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(port, () => {
  connect();
  console.log(`Server is running at http://localhost:${port}`);
});
