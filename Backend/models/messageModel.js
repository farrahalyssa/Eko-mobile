const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

const db = mysql.createPool(dbConfig);

const sendMessage = async (chatRoomId, senderId, receiverId, content) => {
    const messageId = uuidv4();  
    console.log('Parameters:', { messageId, chatRoomId, senderId, receiverId, content });

    if (!chatRoomId || !senderId || !receiverId || !content) {
        throw new Error('Missing required parameters: chatRoomId, senderId, receiverId, or content');
    }

    const sql = `INSERT INTO messages (messageId, chatRoomId, senderId, receiverId, content) VALUES (?, ?, ?, ?, ?)`;
    await db.execute(sql, [messageId, chatRoomId, senderId, receiverId, content]);
    return { messageId };
};


const getMessagesByChatRoom = async (chatRoomId) => {
    const sql = `SELECT * FROM messages WHERE chatRoomId = ? ORDER BY created_at ASC`;
    const [rows] = await db.execute(sql, [chatRoomId]);
    return rows;
};

const markMessagesAsSeen = async (chatRoomId, userId) => {
    const sql = `UPDATE messages SET seen = 1 WHERE chatRoomId = ? AND senderId != ?`;
    await db.execute(sql, [chatRoomId, userId]);
};

module.exports = {
    sendMessage,
    getMessagesByChatRoom,
    markMessagesAsSeen,
};
