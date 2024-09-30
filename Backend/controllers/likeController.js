const likeModel = require('../models/likeModel');
const notificationModel = require('../models/notificationModel');
const postModel = require('../models/postModel');

async function likePost(req, res) {
    const { postId } = req.params;  // Ensure postId is correctly extracted
    const { userId } = req.body;    // Ensure userId is correctly extracted

    console.log(`Received postId: ${postId} and userId: ${userId}`);  // Debugging log

    if (!postId || !userId) {
        return res.status(400).json({ error: 'PostId and UserId are required' });
    }

    // Get the post owner

    try {
        // Check if the post exists
        const postOwnerId = await postModel.getPostOwnerId(postId);
        const postExists = await postModel.getPostById(postOwnerId, postId);
        if (!postExists) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Proceed with liking the post
        await likeModel.likePost(postId, userId);


        // Create a like notification
        if (postOwnerId !== userId) {
            await notificationModel.createNotification(postOwnerId, userId, 'like', postId, 'liked your post');
        }

        res.status(201).json({ message: 'Like created successfully' });
    } catch (err) {
        console.error('Error creating like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


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
