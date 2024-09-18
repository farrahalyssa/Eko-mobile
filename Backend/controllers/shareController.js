const shareModel = require('../models/shareModel');

// Create a share for a post
async function createShare(req, res) {
    let { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json({ error: 'User ID and post ID are required' });
    }

    try {
        await shareModel.createShare(userId, postId);
        res.status(201).json({ message: 'Post shared successfully' });
    } catch (err) {
        console.error('Error sharing post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get all shares for a user
async function getShares(req, res) {
    let { userId } = req.params;

    try {
        let shares = await shareModel.getShares(userId);
        res.status(200).json({
            message: 'Shares fetched successfully',
            shares: shares
        });
    } catch (err) {
        console.error('Error fetching shares:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Unshare a post
async function unsharePost(req, res) {
    let { shareId } = req.params;

    try {
        await shareModel.unsharePost(shareId);
        res.status(200).json({ message: 'Post unshared successfully' });
    } catch (err) {
        console.error('Error unsharing post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createShare,
    getShares,
    unsharePost,
};
