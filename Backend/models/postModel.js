const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const crypto = require('crypto');

async function createPost(userId, content) {
    let connection = await mysql.createConnection(dbConfig);
    let postId = `${crypto.randomBytes(16).toString('hex')}`;
    await connection.execute('INSERT INTO posts (userId, postId, content, created_at) VALUES (?, ?, ?, NOW())', [userId, postId, content]);
    await connection.end();
    return postId;
}

async function deletePost(userId, postId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(`DELETE FROM posts WHERE postId = ? AND userId = ?`, [postId, userId]);
    await connection.execute(`DELETE FROM comments WHERE postId = ?`, [postId]);
    await connection.execute(`DELETE FROM likes WHERE postId = ?`, [postId]);
    await connection.end();
}

async function getPostById(userId,postId) {
    console.log(userId, postId);
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [post] = await connection.execute(`
            SELECT 
                posts.content, 
                posts.imageUri, 
                posts.created_at AS createdAt, 
                users.name, 
                users.username, 
                users.profilephoto_url AS profileImage, 
                users.bio AS userBio, 
                users.userId AS userId, 
                users.created_at AS userCreatedAt,
                IF(likes.userId IS NOT NULL, true, false) AS isLiked
            FROM posts 
            JOIN users ON posts.userId = users.userId
            LEFT JOIN likes ON posts.postId = likes.postId AND likes.userId = ?
            WHERE posts.postId = ?`, [userId, postId]);

        return post[0]; 
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end(); 
        }
    }
}


async function getPostsByUser(userId) {
    let connection = await mysql.createConnection(dbConfig);
    const [posts] = await connection.execute(`
        SELECT posts.postId, posts.content, posts.imageUri, posts.created_at AS createdAt,
               users.name, users.username, users.profilephoto_url AS profileImage, users.bio AS userBio, users.userId AS userId, users.created_at AS userCreatedAt,
               IF(likes.userId IS NOT NULL, true, false) AS isLiked
        FROM posts
        JOIN users ON posts.userId = users.userId
        LEFT JOIN likes ON posts.postId = likes.postId AND likes.userId = ?
        WHERE posts.userId = ?
    `, [userId, userId]); 
    await connection.end();
    return posts;
}
async function getFeedPosts(userId) {
    let connection = await mysql.createConnection(dbConfig);

    // Fetch the list of users this user is following
    const [followedUsers] = await connection.execute(`
        SELECT followingId
        FROM followers
        WHERE followers.userId = ?
    `, [userId]);

    console.log("Followed users:", followedUsers);

    // Map the list of followed users' IDs
    const followedUserIds = followedUsers.map(fu => fu.followingId);
    
    // Include the logged-in user's own posts
    followedUserIds.push(userId);

    console.log("Followed user IDs with logged-in user:", followedUserIds);

    // Create placeholders dynamically for the IN clause based on followedUserIds
    const placeholders = followedUserIds.map(() => '?').join(', ');

    // Final query to get posts from both the logged-in user and their followed users
    const query = `
        SELECT posts.postId, posts.content, posts.imageUri, posts.created_at AS createdAt,
               users.name, users.username, users.profilephoto_url AS profileImage, users.bio AS userBio, users.userId AS userId, users.created_at AS userCreatedAt,
               IF(likes.userId IS NOT NULL, true, false) AS isLiked
        FROM posts
        JOIN users ON posts.userId = users.userId
        LEFT JOIN likes ON posts.postId = likes.postId AND likes.userId = ?
        WHERE posts.userId IN (${placeholders}) 
        ORDER BY posts.created_at DESC
    `;

    // Execute the query with userId and the followed user IDs spread as arguments
    const [posts] = await connection.execute(query, [userId, ...followedUserIds]);

    await connection.end();
    return posts;
}




module.exports = {
    createPost,
    deletePost,
    getPostById,
    getPostsByUser,
    getFeedPosts
};
