const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

// Create a share for a post
async function createShare(userId, postId) {
    let connection = await mysql.createConnection(dbConfig);

    await connection.execute(`
        INSERT INTO shares (userId, postId, created_at) VALUES (?, ?, NOW())
    `, [userId, postId]);

    await connection.end();
}

// Get all shares by a user
async function getShares(userId) {
    let connection = await mysql.createConnection(dbConfig);

    let [shares] = await connection.execute(`
        SELECT * FROM shares WHERE userId = ?
    `, [userId]);

    await connection.end();
    return shares;
}

// Unshare a post
async function unsharePost(shareId) {
    let connection = await mysql.createConnection(dbConfig);

    await connection.execute(`DELETE FROM shares WHERE shareId = ?`, [shareId]);

    await connection.end();
}

module.exports = {
    createShare,
    getShares,
    unsharePost,
};
