const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const crypto = require('crypto');

async function addComment(postId, userId, content) {
    let connection = await mysql.createConnection(dbConfig);
    let commentId = `${crypto.randomBytes(16).toString('hex')}`;
    await connection.execute(
        `INSERT INTO comments (postId, userId, commentId, content, created_at) VALUES (?, ?, ?, ?, NOW())`,
        [postId, userId, commentId, content]
    );
    await connection.end();
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

async function getCommentsForPost(postId) {
    let connection = await mysql.createConnection(dbConfig);
    let [comments] = await connection.execute(`
        SELECT comments.commentId, comments.content, comments.created_at AS createdAt,
               users.name, users.username, users.profilephoto_url AS profileImage
        FROM comments
        JOIN users ON comments.userId = users.userId
        WHERE comments.postId = ?
    `, [postId]);
    await connection.end();
    return comments;
}

async function deleteComment(commentId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(`DELETE FROM comments WHERE commentId = ?`, [commentId]);
    await connection.end();
}

module.exports = {
    addComment,
    getCommentsForPost,
    deleteComment,
    getPostOwner
};

