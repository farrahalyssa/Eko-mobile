const followModel = require('../models/followModel');

async function followUser(req, res) {
    const { userId } = req.params;
    const { followingUserId } = req.body;

    try {
        await followModel.followUser(userId, followingUserId);
        res.status(201).json({ message: 'Follow created successfully' });
    } catch (err) {
        console.error('Error creating follow:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function unfollowUser(req, res) {
    const { userId } = req.params;
    const { followingUserId } = req.body;

    try {
        await followModel.unfollowUser(userId, followingUserId);
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (err) {
        console.error('Error deleting follow:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getFollowers(req, res) {
    const { userId } = req.params;

    try {
        let followers = await followModel.getFollowers(userId);
        res.status(200).json(followers);
    } catch (err) {
        console.error('Error fetching followers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getFollowing(req, res) {
    const { userId } = req.params;

    try {
        let following = await followModel.getFollowing(userId);
        const userIds = following.map(following => following.userId);
        res.status(200).json(following);
    } catch (err) {
        console.error('Error fetching following:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
