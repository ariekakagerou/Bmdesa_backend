// models/Message.js
import db from '../config/db.js';

class Message {
    // Mengirim pesan baru
    static async send({ conversation_id, sender_id, message }) {
        try {
            const [result] = await db.query(`
                INSERT INTO messages (conversation_id, sender_id, message, sent_at, is_read)
                VALUES (?, ?, ?, NOW(), 0)
            `, [conversation_id, sender_id, message]);
            return result.insertId;
        } catch (err) {
            console.error('Error while sending message:', err.message);
            throw new Error('Failed to send message');
        }
    }

    // Mengambil semua pesan dalam percakapan
    static async getByConversationId(conversation_id) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC`, [conversation_id]
            );
            return rows;
        } catch (err) {
            console.error('Error while getting messages:', err.message);
            throw new Error('Failed to get messages');
        }
    }

    // Tandai pesan sebagai sudah dibaca
    static async markAsRead(message_id) {
        try {
            const [result] = await db.query(
                `UPDATE messages SET is_read = 1 WHERE message_id = ?`, [message_id]
            );
            return result;
        } catch (err) {
            console.error('Error while marking message as read:', err.message);
            throw new Error('Failed to mark message as read');
        }
    }
}

export default Message;