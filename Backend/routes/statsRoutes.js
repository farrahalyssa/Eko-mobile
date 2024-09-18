const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Get user profile statistics (posts, followers, following counts)
router.get('/api/users/:userId/stats', statsController.getUserStats);

module.exports = router;
