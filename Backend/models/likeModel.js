const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const crypto = require('crypto');

async function likePost(postId, userId) {
    let connection = await mysql.createConnection(dbConfig);
    const likeId = `${crypto.randomBytes(16).toString('hex')}`;
    await connection.execute('INSERT INTO likes (likeId, postId, userId) VALUES (?, ?, ?)', [likeId, postId, userId]);
    await connection.end();
}

async function unlikePost(postId, userId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM likes WHERE postId = ? AND userId = ?', [postId, userId]);
    await connection.end();
}

async function getLikesForPost(postId) {
    let connection = await mysql.createConnection(dbConfig);
    let [likes] = await connection.execute(`
        SELECT u.userId, u.username, u.name, u.profilephoto_url
        FROM likes l
        JOIN users u ON l.userId = u.userId
        WHERE l.postId = ?
    `, [postId]);
    await connection.end();
    return likes;
}
async function getPostOwner(postId) {
    let connection = await mysql.createConnection(dbConfig);
    let [rows] = await connection.execute(`
        SELECT userId FROM posts WHERE postId = ?
    `, [postId]);
    await connection.end();

    if (rows.length === 0) {
        throw new Error('Post not found');
    }

    return rows[0].userId;
}
async function countLikesForPost(postId) {
    let connection = await mysql.createConnection(dbConfig);
    let [rows] = await connection.execute('SELECT COUNT(*) AS likeCount FROM likes WHERE postId = ?', [postId]);
    await connection.end();
    return rows[0].likeCount;
}

module.exports = {
    likePost,
    unlikePost,
    getLikesForPost,
    countLikesForPost,
    getPostOwner
};
