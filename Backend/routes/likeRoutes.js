const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Like a post
router.post('/api/posts/:postId/likes', likeController.likePost);

// Unlike a post
router.delete('/api/posts/:postId/likes', likeController.unlikePost);

// Get likes for a post
router.get('/api/posts/:postId/likes', likeController.getLikes);

// Count likes for a post
router.get('/api/users/:userId/posts/:postId/countLikes', likeController.countLikes);

module.exports = router;
