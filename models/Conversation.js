// models/Conversation.js
import db from '../config/db.js';

class Conversation {
    // Membuat percakapan baru
    static async create({ user_one_id, user_two_id }) {
        try {
            const [result] = await db.query(`
                INSERT INTO conversations (user_one_id, user_two_id)
                VALUES (?, ?)
            `, [user_one_id, user_two_id]);
            return result.insertId;
        } catch (err) {
            console.error('Error while creating conversation:', err.message);
            throw new Error('Failed to create conversation');
        }
    }

    // Mengambil semua percakapan
    static async getAll() {
        try {
            const [rows] = await db.query(`SELECT * FROM conversations`);
            return rows;
        } catch (err) {
            console.error('Error while getting conversations:', err.message);
            throw new Error('Failed to get conversations');
        }
    }

    // Mengambil percakapan berdasarkan ID
    static async getById(conversation_id) {
        try {
            const [rows] = await db.query(`SELECT * FROM conversations WHERE conversation_id = ?`, [conversation_id]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while getting conversation by ID:', err.message);
            throw new Error('Failed to get conversation by ID');
        }
    }
}

export default Conversation;