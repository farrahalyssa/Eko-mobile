const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const crypto = require('crypto');

// Create a notification
async function createNotification(receiverId, senderId, type, postId, description) {
    let connection = await mysql.createConnection(dbConfig);
    const notificationId = `${crypto.randomBytes(16).toString('hex')}`;
    console.log(notificationId, receiverId, senderId, type, postId, description);
    await connection.execute(
        'INSERT INTO notifications (notificationId, receiverId, senderId, type, postId, description) VALUES (?, ?, ?, ?, ?, ?)',
        [notificationId, receiverId, senderId, type, postId, description]
    );
    await connection.end();
}

async function getNotifications(userId) {
    let connection = await mysql.createConnection(dbConfig);
    const [notifications] = await connection.execute(`
        SELECT notifications.*, users.username AS senderUsername, users.profilephoto_url AS senderProfileImage, users.name AS senderName, users.userId AS senderId, users.bio AS senderBio, users.created_at AS senderCreatedAt, notifications.postId
        FROM notifications
        JOIN users ON notifications.senderId = users.userId
        WHERE notifications.receiverId = ?
        ORDER BY notifications.created_at DESC
    `, [userId]);
    await connection.end();
    return notifications;
}

module.exports = {
    createNotification,
    getNotifications
};
