import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);  // Send message & create chat if needed
router.get('/:chatId', getMessages); // Get all messages in a chat

export default router;
