import express from 'express';
import { sendMessage, getMessages, markMessagesAsRead, getUnreadCount } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);  // Send message & create chat if needed
router.get('/:chatId', getMessages); // Get all messages in a chat
router.put('/mark-read', markMessagesAsRead); // Mark messages as read
router.get('/unread/:chatId/:userId', getUnreadCount); // Get unread count for a chat

export default router;