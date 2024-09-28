const { createChatRoom, findOrCreateChatRoom, getChatRoomById, getChatRoomByUserIds } = require('../models/chatRoomModel');
const { sendMessage, getMessagesByChatRoom, markMessagesAsSeen } = require('../models/messageModel');

const createChatRoomController = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const { chatRoomId } = await findOrCreateChatRoom(senderId, receiverId);

        return res.status(200).json({ chatRoomId });
    } catch (error) {
        console.error('Error creating or finding chat room:', error);  
        return res.status(500).json({ error: 'Failed to create or find chat room', details: error.message });
    }
};

const getChatRoomByUserIdsController = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("Fetching chat rooms for userId:", userId); // Log userId
 ;
  
  
  
      return res.status(200).json(await getChatRoomByUserIds(userId));
    } catch (error) {
      console.error("Error fetching user chats:", error);  
      return res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
  };
  


const getMessagesByChatRoomController = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        const messages = await getMessagesByChatRoom(chatRoomId);
        return res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const markMessagesAsSeenController = async (req, res) => {
    try {
        const { chatRoomId, userId } = req.body;
        await markMessagesAsSeen(chatRoomId, userId);
        return res.status(200).json({ message: 'Messages marked as seen' });
    } catch (error) {
        console.error('Error marking messages as seen:', error);
        return res.status(500).json({ error: 'Failed to mark messages as seen' });
    }
};

module.exports = {
    createChatRoomController,
    getMessagesByChatRoomController,
    markMessagesAsSeenController,
    getChatRoomByUserIdsController
};
