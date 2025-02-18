import Messages from "../models/massageModel.js";
import user from "../models/userModel.js"; // Using the user model from the new project

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Verify both users exist in the database
    const fromUser = await user.findById(from);
    const toUser = await user.findById(to);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Fetch messages between the two users
    const messages = await Messages.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });

    // Transform the message data
    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    }));

    // Send the response
    res.json(projectedMessages);
  } catch (ex) {
    console.error("Error in getMessages:", ex);
    next(ex);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    // Verify both users exist in the database
    const fromUser = await user.findById(from);
    const toUser = await user.findById(to);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Create a new message
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.status(500).json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    console.error("Error in addMessage:", ex);
    next(ex);
  }
};
