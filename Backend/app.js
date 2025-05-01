import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';

import user from './routes/user.js';
import school from './routes/school.js';
import authentication from './routes/authentication.js';
import payment from './routes/payment.js';
import Rating from './routes/rating.js';
import conversations from './routes/conversations.js';
import messages from './routes/messages.js';

import Chat from './models/Chat.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.db2, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Mongo error:', err);
    }
};
app.use(express.json());
const __dirname = path.dirname("");
const buildPath = path.join(__dirname, './build');
app.use(express.static(buildPath));


app.use('/uploads', express.static('uploads'));

const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use('/user', user);
app.use('/school', school);
app.use('/payments', payment);
app.use('/auth', authentication);
app.use('/rating', Rating);
app.use('/conversations', conversations);
app.use('/messages', messages);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: err.message || 'Something went wrong',
        stack: err.stack
    });
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('send_message', async ({ sender, receiver, content }) => {
        try {
            let chat = await Chat.findOne({ members: { $all: [sender, receiver] } });
            if (!chat) {
                chat = new Chat({ members: [sender, receiver] });
                await chat.save();
            }
            const newMessage = new Message({ chatId: chat._id, sender, content });
            await newMessage.save();

            io.to(receiver).emit('receive_message', newMessage);
            io.to(sender).emit('receive_message', newMessage);
        } catch (err) {
            console.error('Send message error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

server.listen(port, () => {
    connect();
    console.log(`Server running on port ${port}`);
});
