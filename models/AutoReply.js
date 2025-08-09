// models/AutoReply.js
import db from '../config/db.js';

class AutoReply {
    // Membuat balasan otomatis baru
    static async create({ user_id, context, reply_message }) {
        try {
            const [result] = await db.query(`
                INSERT INTO auto_replies (user_id, context, reply_message)
                VALUES (?, ?, ?)
            `, [user_id, context, reply_message]);
            return result.insertId;
        } catch (err) {
            console.error('Error while creating auto reply:', err.message);
            throw new Error('Failed to create auto reply');
        }
    }

    // Mengambil semua balasan otomatis
    static async getAll() {
        try {
            const [rows] = await db.query(`SELECT * FROM auto_replies`);
            return rows;
        } catch (err) {
            console.error('Error while getting auto replies:', err.message);
            throw new Error('Failed to get auto replies');
        }
    }

    // Mengambil balasan otomatis berdasarkan ID
    static async getById(reply_id) {
        try {
            const [rows] = await db.query(`SELECT * FROM auto_replies WHERE reply_id = ?`, [reply_id]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while getting auto reply by ID:', err.message);
            throw new Error('Failed to get auto reply by ID');
        }
    }

    // Memperbarui balasan otomatis
    static async update(reply_id, { context, reply_message }) {
        try {
            await db.query(`
                UPDATE auto_replies
                SET context = ?, reply_message = ?
                WHERE reply_id = ?
            `, [context, reply_message, reply_id]);
        } catch (err) {
            console.error('Error while updating auto reply:', err.message);
            throw new Error('Failed to update auto reply');
        }
    }

    // Menghapus balasan otomatis
    static async delete(reply_id) {
        try {
            await db.query(`DELETE FROM auto_replies WHERE reply_id = ?`, [reply_id]);
        } catch (err) {
            console.error('Error while deleting auto reply:', err.message);
            throw new Error('Failed to delete auto reply');
        }
    }
}

export default AutoReply;