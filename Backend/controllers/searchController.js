const searchModel = require('../models/searchModel');

const searchUsers = async (req, res) => {
    const { query } = req.query;

    if (!query || query.length < 2) {
        return res.status(400).json({ error: 'Query must be at least 2 characters long.' });
    }

    try {
        const users = await searchModel.searchUsers(query);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({
            message: 'User data fetched successfully',
            users
        });
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    searchUsers
};

