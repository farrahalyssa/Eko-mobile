const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Create a new post
router.post('/api/users/:userId/posts', postController.createPost);

// Delete a post
router.delete('/api/:userId/posts/:postId', postController.deletePost);

// Get a single post by ID
router.get('/api/users/:userId/posts/:postId', postController.getPostById);

// Get all posts by a user
router.get('/api/users/:userId/posts', postController.getPostsByUser);

module.exports = router;
