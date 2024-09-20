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

async function getPostById(postId) {
    let connection = await mysql.createConnection(dbConfig);
    const [post] = await connection.execute(`
        SELECT 
            posts.content, posts.imageUri, posts.created_at AS createdAt, 
            users.name, users.username, users.profilephoto_url AS profileImage, users.bio AS userBio, users.userId AS userId, users.created_at AS userCreatedAt 
        FROM posts 
        JOIN users ON posts.userId = users.userId 
        WHERE posts.postId = ?`, [postId]);
    await connection.end();
    return post[0];
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

module.exports = {
    createPost,
    deletePost,
    getPostById,
    getPostsByUser,
};
