import express from 'express';
import { getUserChats } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:userId', getUserChats); // Get all chats of a user

export default router;
