import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/userModel.js';
import { School } from '../models/schoolModel.js';

// Send a message (Creates chat if not exists)
export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, content, conversationId } = req.body;
        
        const senderExists = await User.findById(sender) || await School.findById(sender);
        const receiverExists = await User.findById(receiver) || await School.findById(receiver);

        if (!senderExists || !receiverExists) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        let chat;
        if (conversationId) {
            chat = await Chat.findById(conversationId);
        } else {
            // Check if a chat exists
            chat = await Chat.findOne({
                members: { $all: [sender, receiver] }
            });

            // If no chat exists, create a new one
            if (!chat) {
                chat = new Chat({
                    members: [sender, receiver]
                });
                await chat.save();
            }
        }

        // Create and save the message
        const newMessage = new Message({
            chatId: chat._id,
            sender,
            content,
            isRead: false // New messages start as unread
        });

        await newMessage.save();

        res.status(201).json({
            ...newMessage.toObject(),
            conversationId: chat._id,
            chatCreated: !conversationId, // True if new chat was created
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
        const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        
        // Update all unread messages in this chat that weren't sent by this user
        await Message.updateMany(
            { 
                chatId, 
                sender: { $ne: userId },
                isRead: false 
            },
            { 
                isRead: true,
                $push: { readBy: { userId, readAt: new Date() } }
            }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get unread count for a specific chat
export const getUnreadCount = async (req, res) => {
    try {
        const { chatId, userId } = req.params;
        
        const unreadCount = await Message.countDocuments({
            chatId,
            sender: { $ne: userId },
            isRead: false
        });

        res.status(200).json({ unreadCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};