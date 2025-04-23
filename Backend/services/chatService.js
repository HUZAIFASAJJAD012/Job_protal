 // services/chatService.js
import chatModel from '../models/chatModel.js';

const chatService = {
  async saveMessage(data) {
    try {
      const newMessage = new chatModel(data);
      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default chatService;