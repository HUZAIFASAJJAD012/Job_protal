import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import user from './routes/user.js';
import school from './routes/school.js';
import authentication from './routes/authentication.js';
import payment from './routes/payment.js';
import cors from 'cors';
import Rating from './routes/rating.js';
import {Server} from 'socket.io';
import {createServer} from "http";
import conversations from './routes/conversations.js';
import messages from './routes/messages.js';
import path from "path"

dotenv.config();
const app = express();
const port = process.env.PORT || '8000';

// DB Connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.db2, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('MongoDB has connected successfully');
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};

// Middleware
app.use(express.json());
const _dirname=path.dirname("")

const buildpath=path.join(_dirname,"../Frontend/build")
app.use(express.static(buildpath));

app.use(cors()); // Use the configured CORS options
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/user', user);
app.use('/school', school);
app.use('/payments', payment);
app.use('/auth', authentication);
app.use('/rating', Rating);


app.use('/conversations', conversations);
app.use('/messages', messages);

// Error Handling Middleware
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

// Server and Socket.IO Setup
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'http://54.175.124.76',  // Allow requests from your frontend production domain
            'http://localhost:3000'   // Allow requests from your local frontend during development
        ],
        credentials: true, // Allow credentials (cookies, authorization headers, etc.),
    },
});

// Socket.IO Connection Handling
import Chat from './models/Chat.js';
import Message from './models/Message.js';

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins their room (for private messaging)
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // Handle new messages
    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
        try {
            // Check if chat already exists between these users
            let chat = await Chat.findOne({ members: { $all: [senderId, receiverId] } });

            // If no chat exists, create a new one
            if (!chat) {
                chat = new Chat({ members: [senderId, receiverId] });
                await chat.save();
            }

            // Save the message in the database
            const newMessage = new Message({ chatId: chat._id, sender: senderId, content });
            await newMessage.save();

            // Emit the message only to the receiver
            io.to(receiverId).emit('receiveMessage', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(port, () => {
    connect(); // Ensure your DB connection is initialized
    console.log(`Server is running at http://localhost:${port}`);
});