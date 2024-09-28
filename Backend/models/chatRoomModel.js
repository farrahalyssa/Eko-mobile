const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

const db = mysql.createPool(dbConfig);

const createChatRoom = async (senderId, receiverId) => {
    const chatRoomId = uuidv4(); 
    const sql = `INSERT INTO chatRoom (chatRoomId) VALUES (?)`; 
    await db.execute(sql, [chatRoomId]);
    return { chatRoomId };
};

const findOrCreateChatRoom = async (senderId, receiverId) => {
    const sql = `
      SELECT DISTINCT chatRoomId 
      FROM messages 
      WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [senderId, receiverId, receiverId, senderId]);

    if (rows.length > 0) {
        console.log('Chat room found:', rows[0].chatRoomId);
        return { chatRoomId: rows[0].chatRoomId };
    }

    console.log('Chat room not found. Creating new one...');
    const { chatRoomId } = await createChatRoom(senderId, receiverId);
    
   
    return { chatRoomId };
};

const getChatRoomById = async (chatRoomId) => {
    const sql = `SELECT * FROM chatRoom WHERE chatRoomId = ?`;
    const [rows] = await db.execute(sql, [chatRoomId]);
    return rows.length > 0 ? rows[0] : null;
};

const getChatRoomByUserIds = async (userId) => {
    const sql = `
        SELECT * 
        FROM messages 
        WHERE senderId = ? OR receiverId = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;
    
    if (!userId) {
      throw new Error('userId is undefined');
    }

    const [rows] = await db.execute(sql, [userId, userId]);
    return rows.length > 0 ? rows[0] : null;
};


  
module.exports = {
    createChatRoom,
    findOrCreateChatRoom,
    getChatRoomById,
    getChatRoomByUserIds
};
