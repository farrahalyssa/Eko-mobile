const commentModel = require('../models/commentModel');
const notificationModel = require('../models/notificationModel'); // Import notification model

async function addComment(req, res) {
    const { postId } = req.params;
    const { userId, content } = req.body;
    console.log('Received userId:', userId, 'and content:', content, 'for postId:', postId);

    if (!userId || !content) {
        return res.status(400).json({ error: 'Missing userId or content' });
    }

    try {
        await commentModel.addComment(postId, userId, content);

        // Get post owner (assume you have a method for this in postModel)
        const postOwnerId = await commentModel.getPostOwner(postId);

        // Create a comment notification
        if (postOwnerId !== userId) {
            await notificationModel.createNotification(postOwnerId, userId, 'comment', postId, content);
        }

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getComments(req, res) {
    const { postId } = req.params;

    try {
        let comments = await commentModel.getCommentsForPost(postId);
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteComment(req, res) {
    const { commentId } = req.params;

    try {
        await commentModel.deleteComment(commentId);
        res.status(200).json("Comment deleted.");
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addComment,
    getComments,
    deleteComment,
};
