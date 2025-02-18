import chatService from '../services/chatService.js';

/**
 * Send a new chat message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user?.id; // Assuming senderId is fetched from req.user
        const { receiverId } = req.body; // Receiver ID still comes from the request body
        const { message } = req.body;

        // Validate required fields
        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Save the message
        const savedMessage = await chatService.saveMessage({ senderId, receiverId, message });

        return res.status(201).json({ message: 'Message sent', data: savedMessage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

/**
 * Fetch all messages between two users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMessages = async (req, res) => {
    try {
        const userId1 = req.user?.id; // Assuming userId1 is fetched from req.user
        const { userId2 } = req.query; // UserId2 comes from the query params

        // Validate required fields
        if (!userId1 || !userId2) {
            return res.status(400).json({ error: 'User IDs are required' });
        }

        // Get messages
        const messages = await chatService.getMessagesBetweenUsers(userId1, userId2);

        return res.status(200).json({ data: messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

/**
 * Delete a specific chat message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Validate required fields
        if (!messageId) {
            return res.status(400).json({ error: 'Message ID is required' });
        }

        // Delete the message
        const deletedMessage = await chatService.deleteMessage(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        return res.status(200).json({ message: 'Message deleted', data: deletedMessage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
