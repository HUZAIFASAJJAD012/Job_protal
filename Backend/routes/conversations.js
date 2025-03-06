import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Conversation model
const Conversation = mongoose.model('Conversation', {
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

// Get all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find().populate('users').populate('messages');
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Get conversation by id
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate('users').populate('messages');
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
});

// Create new conversation
router.post('/', async (req, res) => {
  try {
    const conversation = new Conversation({
      users: req.body.users,
      messages: []
    });
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
});

// Add message to conversation
router.post('/:id/messages', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const message = new Message({
      text: req.body.text,
      sender: req.body.sender
    });
    conversation.messages.push(message);
    await conversation.save();
    await message.save();
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding message to conversation' });
  }
});

// Get messages in conversation
router.get('/:id/messages', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate('messages');
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Update conversation
router.put('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    conversation.users = req.body.users;
    conversation.messages = req.body.messages;
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating conversation' });
  }
});

// Delete conversation
router.delete('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    await conversation.remove();
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
});

export default router;