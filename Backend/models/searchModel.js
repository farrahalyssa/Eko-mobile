const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig'); 

const searchUsers = async (query) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [users] = await connection.execute(`
            SELECT userId, name, username, profilephoto_url AS profileImage, bio, active, created_at
            FROM users
            WHERE name LIKE ? OR username LIKE ?
        `, [`%${query}%`, `%${query}%`]);

        return users;
    } catch (error) {
        console.error('Error in searchUsers:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = {
    searchUsers
};
