const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

router.post('/api/users/:userId/follow', followController.followUser);

router.delete('/api/users/:userId/follow', followController.unfollowUser);

router.get('/api/users/:userId/followersData', followController.getFollowers);

router.get('/api/users/:userId/followingData', followController.getFollowing);

module.exports = router;

