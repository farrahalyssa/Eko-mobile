const commentModel = require('../models/commentModel');

async function addComment(req, res) {
    const { postId } = req.params;
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res.status(400).json({ error: 'Missing userId or content' });
    }

    try {
        await commentModel.addComment(postId, userId, content);
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
