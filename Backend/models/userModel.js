const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

async function getAllUsers() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        let [users] = await connection.execute('SELECT userId, name, username, email FROM users');
        return users;
    } finally {
        if (connection) connection.end();
    }
}

async function registerUser(name, username, email, hashedPassword, userId) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO users (name, userId, username, email, password, bio, active) VALUES (?, ?, ?, ?, ?, null, 1)',
            [name, userId, username, email, hashedPassword]
        );
    } finally {
        if (connection) connection.end();
    }
}

async function findUserByEmailOrUsername(email, username) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        let query = 'SELECT * FROM users WHERE email = ? OR username = ?';
        let [user] = await connection.execute(query, [email, username]);
        return user;
    } finally {
        if (connection) connection.end();
    }
}

async function updateUserActiveStatus(userId, activeStatus) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE users SET active = ? WHERE userId = ?', [activeStatus, userId]);
    } finally {
        if (connection) connection.end();
    }
}

async function deleteUserById(userId) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM users WHERE userId = ?', [userId]);
    } finally {
        if (connection) connection.end();
    }
}

async function findUserByEmail(email) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        let query = 'SELECT * FROM users WHERE email = ?';
        let [user] = await connection.execute(query, [email]);
        return user;
    } finally {
        if (connection) connection.end();
    }
}

async function updateUserProfile(userId, name, username, bio, profilephoto_url) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const updateUserQuery = `
            UPDATE users
            SET name = IFNULL(?, name), 
                username = IFNULL(?, username), 
                bio = IFNULL(?, bio), 
                profilephoto_url = IFNULL(?, profilephoto_url)
            WHERE userId = ?
        `;

        await connection.execute(updateUserQuery, [name, username, bio, profilephoto_url, userId]);
    } finally {
        if (connection) connection.end();
    }
}


async function findUserById(userId) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [user] = await connection.execute('SELECT * FROM users WHERE userId = ?', [userId]);
        return user[0]; 
        if (connection) connection.end();
    }finally {
        if (connection) connection.end();
    }
}

module.exports = {
    getAllUsers,
    registerUser,
    findUserByEmailOrUsername,
    findUserByEmail,
    findUserById,
    updateUserActiveStatus,
    deleteUserById,
    updateUserProfile
};
