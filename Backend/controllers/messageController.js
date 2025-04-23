import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/userModel.js';
import { School } from '../models/schoolModel.js';

// Send a message (Creates chat if not exists)
export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;
        
        const senderExists = await User.findById(sender) || await School.findById(sender);
        const receiverExists = await User.findById(receiver) || await School.findById(receiver);

        if (!senderExists || !receiverExists) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        // Check if a chat exists
        let chat = await Chat.findOne({
            members: { $all: [sender, receiver] }
        });

        // If no chat exists, create a new one
        if (!chat) {
            chat = new Chat({
                members: [sender, receiver]
            });
            await chat.save();
        }

        // Create and save the message
        const newMessage = new Message({
            chatId: chat._id,
            sender,
            content
        });

        await newMessage.save();

        res.status(201).json({
            message: newMessage,
            chatCreated: !chat._id, // True if new chat was created
            chat
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all messages in a chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
