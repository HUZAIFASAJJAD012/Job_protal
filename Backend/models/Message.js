import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // Reference to chat
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Sender of the message
    content: { type: String, required: true }, // Message text
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MessageSchema);
