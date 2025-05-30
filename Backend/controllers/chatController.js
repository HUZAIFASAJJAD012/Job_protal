import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { School } from "../models/schoolModel.js";
import User from "../models/userModel.js";

/**
 * Get all user chats with unread counts and last message info
 */
export const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId; // Get current user ID from params

    const chats = await Chat.find({ members: userId });

    // Fetch chat members and additional info
    const chatData = await Promise.all(
      chats.map(async (chat) => {
        // Find the recipient (the other person in the chat)
        const recipientId = chat.members.find(
          (member) => member.toString() !== userId
        );

        let recipientData = await User.findById(recipientId).select(
          "firstName lastName"
        );

        // If not found in User model, check the School model
        if (!recipientData) {
          recipientData = await School.findById(recipientId).select(
            "schoolName"
          );
        }

        // Get the last message in this chat
        const lastMessage = await Message.findOne({ chatId: chat._id })
          .sort({ timestamp: -1 })
          .populate('sender', 'firstName lastName schoolName');

        // Get unread message count for this user
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          isRead: false
        });

        return {
          _id: chat._id,
          recipientName: recipientData
            ? recipientData.firstName
              ? `${recipientData.firstName} ${recipientData.lastName}`
              : recipientData.schoolName
            : "Unknown",
          members: chat.members,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.timestamp,
            sender: lastMessage.sender,
            isRead: lastMessage.isRead
          } : null,
          unreadCount,
          createdAt: chat.createdAt
        };
      })
    );

    res.json(chatData);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Error fetching chats" });
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (req, res) => {
  try {
    const { members, recipientName } = req.body;

    // Check if conversation already exists
    let chat = await Chat.findOne({
      members: { $all: members },
    });

    if (chat) {
      return res.status(200).json(chat); // Return existing chat without creating a new one
    }

    // Create a new chat if it doesn't exist
    chat = new Chat({ members });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Error creating conversation" });
  }
};