const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/api/chatrooms/:chatRoomId/messages', messageController.sendMessageController);

router.get('/api/chatrooms/:chatRoomId/messages', messageController.getMessagesByChatRoomController);

router.post('/api/chatrooms/:chatRoomId/messages/mark-seen', messageController.markMessagesAsSeenController);

module.exports = router;
