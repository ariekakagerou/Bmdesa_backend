import pool from '../config/db.js';

class UserLog {
    static async create({ user_id, action, ip_address, device_info }) {
        try {
            user_id = user_id ?? null;
            action = action ?? null;
            ip_address = ip_address ?? null;
            device_info = device_info ?? null;


            await pool.execute(
                `INSERT INTO user_logs (user_id, action, ip_address, device_info, created_at)
                 VALUES (?, ?, ?, ?, NOW())`, [user_id, action, ip_address, device_info]
            );
        } catch (err) {
            console.error('Error while creating user log:', err.message);
            throw new Error('Failed to create user log');
        }
    }

    static async getAll() {
        try {
            const [rows] = await pool.execute(`SELECT * FROM user_log ORDER BY created_at DESC`);
            return rows;
        } catch (err) {
            console.error('Error while getting user logs:', err.message);
            throw new Error('Failed to retrieve user logs');
        }
    }

    static async getByUserId(user_id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM user_log WHERE user_id = ? ORDER BY created_at DESC`, [user_id]);
            return rows;
        } catch (err) {
            console.error('Error while getting user logs by user_id:', err.message);
            throw new Error('Failed to retrieve user logs by user_id');
        }
    }
}

export default UserLog;