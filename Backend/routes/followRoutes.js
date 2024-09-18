const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

// Follow a user
router.post('/api/users/:userId/follow', followController.followUser);

// Unfollow a user
router.delete('/api/users/:userId/follow', followController.unfollowUser);

// Get followers
router.get('/api/users/:userId/followersData', followController.getFollowers);

// Get following
router.get('/api/users/:userId/followingData', followController.getFollowing);

module.exports = router;

