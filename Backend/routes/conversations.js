import express from 'express';
import { createConversation, getUserChats } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:userId', getUserChats); // Get all chats of a user
router.post('/', createConversation); 

export default router;
