import pool from '../config/db.js';

class ActivityLog {
    getAll() {
        return pool.query('SELECT * FROM activity_logs');
    }

    getById(id) {
        // Implementasi fungsi di sini
    }

    create(data) {
        const { user_id, activity, timestamp } = data;
        return pool.query(
            'INSERT INTO activity_logs (user_id, activity, timestamp) VALUES (?, ?, ?)', [user_id, activity, timestamp]
        );
    }

    update(id, data) {
        const { user_id, activity, timestamp } = data;
        return pool.query(
            'UPDATE activity_logs SET user_id = ?, activity = ?, timestamp = ? WHERE id = ?', [user_id, activity, timestamp, id]
        );
    }

    delete(id) {
        return pool.query('DELETE FROM activity_logs WHERE id = ?', [id]);
    }
}

export default ActivityLog;