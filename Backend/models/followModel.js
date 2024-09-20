const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

async function followUser(userId, followingUserId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO followers (userId, followingId, created_at) VALUES (?, ?, NOW())', [userId, followingUserId]);
    await connection.end();
}

async function unfollowUser(userId, followingUserId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM followers WHERE userId = ? AND followingId = ?', [userId, followingUserId]);
    await connection.end();
}

async function getFollowers(userId) {
    let connection = await mysql.createConnection(dbConfig);
    let [followers] = await connection.execute(`
        SELECT users.userId, users.name, users.username, users.profilephoto_url AS profileImage
        FROM followers
        JOIN users ON followers.userId = users.userId
        WHERE followers.followingId = ?
    `, [userId]);
    await connection.end();
    return followers;
}

async function getFollowing(userId) {
    let connection = await mysql.createConnection(dbConfig);
    let [following] = await connection.execute(`
        SELECT users.userId, users.name, users.username, users.profilephoto_url AS profileImage
        FROM followers
        JOIN users ON followers.followingId = users.userId
        WHERE followers.userId = ?
    `, [userId]);
    await connection.end();
    return following;
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
