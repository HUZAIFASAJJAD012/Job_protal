import Chat from "../models/Chat.js";
import { School } from "../models/schoolModel.js";
import User from "../models/userModel.js";

export const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId; // Get current user ID from params

    const chats = await Chat.find({ "members.memberId": userId });

    // Fetch chat members (User or School)
    const chatData = await Promise.all(
      chats.map(async (chat) => {
        const recipient = chat.members.find(
          (member) => member.memberId.toString() !== userId
        );

        if (!recipient) {
          return { _id: chat._id, recipientName: "Unknown", members: chat.members };
        }

        let recipientData;
        if (recipient.memberType === "User") {
          recipientData = await User.findById(recipient.memberId).select("firstName lastName");
        } else if (recipient.memberType === "School") {
          recipientData = await School.findById(recipient.memberId).select("schoolName");
        }

        return {
          _id: chat._id,
          recipientName: recipientData
            ? recipientData.firstName
              ? `${recipientData.firstName} ${recipientData.lastName}`
              : recipientData.schoolName
            : "Unknown",
          members: chat.members,
        };
      })
    );

    res.json(chatData);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Error fetching chats" });
  }
};
