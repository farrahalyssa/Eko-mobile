const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');

router.post('/api/chatrooms/find-or-create', chatRoomController.createChatRoomController);

router.get('/api/chatrooms/:chatRoomId/messages', chatRoomController.getMessagesByChatRoomController);

router.post('/api/chatrooms/:chatRoomId/mark-seen', chatRoomController.markMessagesAsSeenController);

module.exports = router;
