import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';
import detect from 'detect-port';
import notificationRoutes from './routes/notificationRoutes.js';
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
const DEFAULT_PORT = parseInt(process.env.PORT) || 8000;

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.db2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
};

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, './build');

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

// Stripe webhook route (must use raw body)
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Middleware
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
app.use('/notifications', notificationRoutes);
// Error handler
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

// Main server logic
const startServer = async () => {
  const port = await detect(DEFAULT_PORT);

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

   // Replace your socket.on('send_message') handler with this:

socket.on('send_message', async ({ sender, receiver, content, conversationId }) => {
  try {
    let chat;
    
    if (conversationId) {
      // Use existing conversation
      chat = await Chat.findById(conversationId);
    } else {
      // Find or create new conversation
      chat = await Chat.findOne({ members: { $all: [sender, receiver] } });
      
      if (!chat) {
        chat = new Chat({ members: [sender, receiver] });
        await chat.save();
      }
    }

    const newMessage = new Message({
      chatId: chat._id,
      sender,
      content,
      timestamp: new Date(),
      isRead: false // Important: messages start as unread
    });

    await newMessage.save();

    // Create the message object to send to clients
    const messageToSend = {
      _id: newMessage._id,
      chatId: newMessage.chatId,
      sender: newMessage.sender,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
      isRead: newMessage.isRead,
      conversationId: chat._id // This is crucial for frontend
    };

    // Send to both sender and receiver
    io.to(receiver).emit('receive_message', messageToSend);
    io.to(sender).emit('receive_message', messageToSend);
    
    console.log(`Message sent from ${sender} to ${receiver}: ${content}`);
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('message_error', { error: 'Failed to send message' });
  }
});
// Add this to your backend app.js socket handlers:

socket.on('message_read', async ({ messageId, readBy, conversationId }) => {
  try {
    // Update message as read in database
    await Message.findByIdAndUpdate(messageId, { 
      isRead: true,
      $push: { readBy: { userId: readBy, readAt: new Date() } }
    });

    // Find the chat to get both members
    const chat = await Chat.findById(conversationId);
    
    // Send read receipt to the original sender
    chat.members.forEach(memberId => {
      if (memberId.toString() !== readBy.toString()) {
        io.to(memberId.toString()).emit('message_read', {
          messageId,
          readBy,
          conversationId
        });
      }
    });

    console.log(`Message ${messageId} marked as read by ${readBy}`);
  } catch (error) {
    console.error('Error handling message read:', error);
  }
});
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    connect();
    console.log(`🚀 Server is running at http://localhost:${port}`);
  });
};

startServer();
