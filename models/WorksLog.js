// models/WorksLog.js
import db from '../config/db.js';

class WorksLog {
    static async createLog(userId, date, activity) {
        const [result] = await db.query(`
            INSERT INTO works_log (user_id, date, activity, created_at)
            VALUES (?, ?, ?, NOW())
        `, [userId, date, activity]);
        return result;
    }

    static async getLogsByUserId(userId) {
        const [rows] = await db.query(`
            SELECT * FROM works_log WHERE user_id = ? ORDER BY date DESC, created_at DESC
        `, [userId]);
        return rows;
    }

    static async updateLog(logId, activity) {
        const [result] = await db.query(`
            UPDATE works_log
            SET activity = ?
            WHERE log_id = ?
        `, [activity, logId]);
        return result;
    }

    static async deleteLog(logId) {
        const [result] = await db.query(`
            DELETE FROM works_log WHERE log_id = ?
        `, [logId]);
        return result;
    }
}

export default WorksLog;