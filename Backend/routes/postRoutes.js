const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/api/users/:userId/posts', postController.createPost);

router.delete('/api/:userId/posts/:postId', postController.deletePost);

router.get('/api/users/:userId/posts/:postId', postController.getPostById);

router.get('/api/users/:userId/posts', postController.getPostsByUser);

router.get('/api/users/:userId/feed', postController.getFeedPosts);

module.exports = router;
