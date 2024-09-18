const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// Create a share
router.post('/api/shares', shareController.createShare);

// Get all shares for a user
router.get('/api/shares/:userId', shareController.getShares);

// Unshare a post
router.delete('/api/shares/:shareId', shareController.unsharePost);

module.exports = router;
