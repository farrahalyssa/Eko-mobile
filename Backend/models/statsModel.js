const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

async function getUserStats(userId) {
    console.log(userId);

    let connection = await mysql.createConnection(dbConfig);

    let [stats] = await connection.execute(`
        SELECT 
            (SELECT COUNT(*) FROM posts WHERE userId = ?) AS countPosts,
            (SELECT COUNT(*) FROM followers WHERE followingId = ?) AS countFollowers,
            (SELECT COUNT(*) FROM followers WHERE userId = ?) AS countFollowing
        FROM users
        WHERE userId = ?
    `, [userId, userId, userId, userId]);

    await connection.end();
    console.log(stats);
    return stats[0]; 
}

module.exports = {
    getUserStats,
};
