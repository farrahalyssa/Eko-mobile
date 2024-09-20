const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/api/posts/:postId/comments', commentController.addComment);

router.get('/api/posts/:postId/comments', commentController.getComments);

router.delete('/api/posts/comments/:commentId', commentController.deleteComment);

module.exports = router;
