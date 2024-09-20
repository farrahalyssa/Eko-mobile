const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');


router.post('/api/posts/:postId/likes', likeController.likePost);

router.delete('/api/posts/:postId/likes', likeController.unlikePost);

router.get('/api/posts/:postId/likes', likeController.getLikes);

router.get('/api/users/:userId/posts/:postId/countLikes', likeController.countLikes);

module.exports = router;
