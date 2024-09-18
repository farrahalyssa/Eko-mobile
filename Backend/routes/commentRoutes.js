const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Add a comments
router.post('/api/posts/:postId/comments', commentController.addComment);

// Get comments for a post
router.get('/api/posts/:postId/comments', commentController.getComments);

// Delete a comment
router.delete('/api/posts/comments/:commentId', commentController.deleteComment);

module.exports = router;
