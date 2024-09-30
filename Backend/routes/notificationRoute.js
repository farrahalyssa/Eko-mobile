const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/api/users/:userId/notifications', notificationController.getNotifications);

module.exports = router;
