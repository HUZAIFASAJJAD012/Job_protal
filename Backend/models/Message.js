import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }, // Track if message is read
    readBy: [{ // Track who read the message and when
        userId: { type: mongoose.Schema.Types.ObjectId },
        readAt: { type: Date, default: Date.now }
    }]
});

export default mongoose.model('Message', MessageSchema);