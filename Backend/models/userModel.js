const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

async function getAllUsers() {
    let connection = await mysql.createConnection(dbConfig);
    let [users] = await connection.execute('SELECT userId, name, username, email FROM users');
    await connection.end();
    return users;
}

async function registerUser(name, username, email, hashedPassword, userId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(
        'INSERT INTO users (name, userId, username, email, password, bio, active) VALUES (?, ?, ?, ?, ?, null, 1)',
        [name, userId, username, email, hashedPassword]
    );
    await connection.end();
}

async function findUserByEmail(email) {
    let connection = await mysql.createConnection(dbConfig);
    let query = email ? 'SELECT * FROM users WHERE email = ?' : 'SELECT * FROM users WHERE username = ?';
    let queryParam = email ;
    let [user] = await connection.execute(query, [queryParam]);
    await connection.end();
    return user;
}

async function updateUserActiveStatus(userId, activeStatus) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE users SET active = ? WHERE userId = ?', [activeStatus, userId]);
    await connection.end();
}

async function deleteUserById(userId) {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(`DELETE FROM users WHERE userId = ?`, [userId]);
    await connection.end();
}


module.exports = {
    getAllUsers,
    registerUser,
    findUserByEmail,
    updateUserActiveStatus,
    deleteUserById,
};
