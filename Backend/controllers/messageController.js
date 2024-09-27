const { sendMessage, getMessagesByChatRoom, markMessagesAsSeen } = require('../models/messageModel');

const sendMessageController = async (req, res) => {
    try {
        const { chatRoomId, senderId, receiverId, content } = req.body;
        const message = await sendMessage(chatRoomId, senderId, receiverId, content);
        return res.status(200).json({ messageId: message.messageId });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
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
    sendMessageController,
    getMessagesByChatRoomController,
    markMessagesAsSeenController
};
