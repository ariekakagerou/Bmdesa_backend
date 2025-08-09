// models/LeaveRequest.js
import db from '../config/db.js';

class LeaveRequest {
    static async createLeaveRequest(userId, leaveDate, reason, status) {
        const [result] = await db.query(`
            INSERT INTO leave_requests (user_id, leave_date, reason, status)
            VALUES (?, ?, ?, ?)
        `, [userId, leaveDate, reason, status]);
        return result;
    }

    static async getLeaveRequestsByUserId(userId) {
        const [rows] = await db.query(`
            SELECT * FROM leave_requests WHERE user_id = ?
        `, [userId]);
        return rows;
    }

    static async updateLeaveRequest(requestId, reason, status) {
        const [result] = await db.query(`
            UPDATE leave_requests
            SET reason = ?, status = ?
            WHERE request_id = ?
        `, [reason, status, requestId]);
        return result;
    }

    static async deleteLeaveRequest(requestId) {
        const [result] = await db.query(`
            DELETE FROM leave_requests WHERE request_id = ?
        `, [requestId]);
        return result;
    }
}

export default LeaveRequest;