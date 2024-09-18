const likeModel = require('../models/likeModel');

// Like a post
async function likePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!postId || !userId) {
        return res.status(400).json({ error: 'PostId and UserId are required' });
    }

    try {
        await likeModel.likePost(postId, userId);
        res.status(201).json({ message: 'Like created successfully' });
    } catch (err) {
        console.error('Error creating like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Unlike a post
async function unlikePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!postId || !userId) {
        return res.status(400).json({ error: 'PostId and UserId are required' });
    }

    try {
        await likeModel.unlikePost(postId, userId);
        res.status(200).json({ message: 'Like deleted successfully' });
    } catch (err) {
        console.error('Error deleting like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get likes for a post
async function getLikes(req, res) {
    const { postId } = req.params;

    try {
        let likes = await likeModel.getLikesForPost(postId);
        res.status(200).json(likes);
    } catch (err) {
        console.error('Error fetching likes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Count likes for a post
async function countLikes(req, res) {
    const { postId } = req.params;

    try {
        let likeCount = await likeModel.countLikesForPost(postId);
        res.status(200).json({ likeCount });
    } catch (err) {
        console.error('Error fetching likes count:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    likePost,
    unlikePost,
    getLikes,
    countLikes,
};
