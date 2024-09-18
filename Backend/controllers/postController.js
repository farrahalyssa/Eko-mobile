const postModel = require('../models/postModel');

// Create a new post
async function createPost(req, res) {
    let { userId } = req.params;
    let { content } = req.body;

    if (!content || !userId) {
        return res.status(400).json({ error: 'Post content and userId are required' });
    }

    try {
        let postId = await postModel.createPost(userId, content);
        res.status(201).json({ message: 'Post created successfully', postId, userId });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a post
async function deletePost(req, res) {
    let { userId, postId } = req.params;

    try {
        await postModel.deletePost(userId, postId);
        res.status(200).json({ message: 'Post deleted!' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get a single post by its ID
async function getPostById(req, res) {
    const { postId } = req.params;

    try {
        const postDetails = await postModel.getPostById(postId);
        if (!postDetails) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(postDetails);
    } catch (err) {
        console.error('Error fetching post details:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get all posts by a user
async function getPostsByUser(req, res) {
    let { userId } = req.params;

    try {
        let posts = await postModel.getPostsByUser(userId);
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createPost,
    deletePost,
    getPostById,
    getPostsByUser,
};
