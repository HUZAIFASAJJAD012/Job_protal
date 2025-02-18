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
import massageRoute from './routes/massages.js';

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

// CORS configuration
const corsOptions = {
    origin: [
        'http://54.175.124.76',  // Allow requests from your frontend production domain
        'http://localhost:3000'   // Allow requests from your local frontend during development
    ],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};


app.use(cors(corsOptions)); // Use the configured CORS options
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/user', user);
app.use('/school', school);
app.use('/payments', payment);
app.use('/auth', authentication);
app.use('/rating', Rating);
app.use('/messages', massageRoute);

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
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    },
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle incoming messages from users
    socket.on('sendMessage', (messageData) => {
        // Emit message to the specified receiver
        io.to(messageData.receiverId).emit('receiveMessage', messageData);
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
