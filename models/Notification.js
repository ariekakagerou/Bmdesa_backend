import db from '../config/db.js';

class Notification {
    static async create({ user_id, message }) {
        const [result] = await db.query(
            `INSERT INTO notifications (user_id, message, is_read, created_at)
             VALUES (?, ?, 0, NOW())`, [user_id, message]
        );
        return result.insertId;
    }

    static async getByUserId(user_id) {
        const [rows] = await db.query(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`, [user_id]
        );
        return rows;
    }

    static async markAsRead(notification_id) {
        const [result] = await db.query(
            `UPDATE notifications SET is_read = 1 WHERE notification_id = ?`, [notification_id]
        );
        return result;
    }

    static async delete(notification_id) {
        const [result] = await db.query(
            `DELETE FROM notifications WHERE notification_id = ?`, [notification_id]
        );
        return result;
    }
}

export default Notification;