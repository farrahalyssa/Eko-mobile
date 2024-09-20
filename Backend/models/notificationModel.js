const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

async function getNotifications(userId) {
    let connection = await mysql.createConnection(dbConfig);

    let [notifications] = await connection.execute(`
        SELECT * FROM notifications WHERE userId = ?
    `, [userId]);

    await connection.end();
    return notifications;
}

async function createNotification(userId, content) {
    let connection = await mysql.createConnection(dbConfig);

    await connection.execute(`
        INSERT INTO notifications (userId, content, created_at) VALUES (?, ?, NOW())
    `, [userId, content]);

    await connection.end();
}

async function deleteNotification(notificationId) {
    let connection = await mysql.createConnection(dbConfig);

    await connection.execute(`DELETE FROM notifications WHERE notificationId = ?`, [notificationId]);

    await connection.end();
}

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification,
};
