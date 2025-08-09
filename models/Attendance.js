// models/AttendanceModel.js
import pool from '../config/db.js';

class AttendanceModel {
    // Membuat record attendance baru
    static async create(attendanceData) {
        const { user_id, date, check_in, check_out, status, notes } = attendanceData;
        
        const query = `
            INSERT INTO attendances (user_id, date, check_in, check_out, status, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        try {
            const [result] = await pool.execute(query, [user_id, date, check_in, check_out, status, notes]);
            return {
                success: true,
                insertId: result.insertId,
                message: 'Attendance record created successfully'
            };
        } catch (error) {
            throw new Error(`Failed to create attendance: ${error.message}`);
        }
    }

    // Mendapatkan attendance berdasarkan ID
    static async findById(attendanceId) {
        const query = `
            SELECT * FROM attendances 
            WHERE attendance_id = ?
        `;
        
        try {
            const [rows] = await pool.execute(query, [attendanceId]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Failed to fetch attendance: ${error.message}`);
        }
    }

    // Mendapatkan attendance berdasarkan user_id dan date
    static async findByUserAndDate(userId, date) {
        const query = `
            SELECT * FROM attendances 
            WHERE user_id = ? AND date = ?
        `;
        
        try {
            const [rows] = await pool.execute(query, [userId, date]);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch attendance: ${error.message}`);
        }
    }

    // Mendapatkan semua attendance berdasarkan user_id
    static async findByUserId(userId, limit = 50, offset = 0) {
        const query = `
            SELECT * FROM attendances 
            WHERE user_id = ? 
            ORDER BY date DESC, created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        try {
            const [rows] = await pool.execute(query, [userId, limit, offset]);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch user attendances: ${error.message}`);
        }
    }

    // Mendapatkan semua attendance dengan pagination
    static async findAll(limit = 50, offset = 0) {
        const query = `
            SELECT * FROM attendances 
            ORDER BY date DESC, created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        try {
            const [rows] = await pool.execute(query, [limit, offset]);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch all attendances: ${error.message}`);
        }
    }

    // Update attendance
    static async update(attendanceId, updateData) {
        const { check_in, check_out, status, notes } = updateData;
        
        const query = `
            UPDATE attendances 
            SET check_in = ?, check_out = ?, status = ?, notes = ?, updated_at = NOW()
            WHERE attendance_id = ?
        `;
        
        try {
            const [result] = await pool.execute(query, [check_in, check_out, status, notes, attendanceId]);
            
            if (result.affectedRows === 0) {
                return { success: false, message: 'Attendance record not found' };
            }
            
            return { success: true, message: 'Attendance updated successfully' };
        } catch (error) {
            throw new Error(`Failed to update attendance: ${error.message}`);
        }
    }

    // Update check-in time
    static async updateCheckIn(attendanceId, checkInTime) {
        const query = `
            UPDATE attendances 
            SET check_in = ?, updated_at = NOW()
            WHERE attendance_id = ?
        `;
        
        try {
            const [result] = await pool.execute(query, [checkInTime, attendanceId]);
            
            if (result.affectedRows === 0) {
                return { success: false, message: 'Attendance record not found' };
            }
            
            return { success: true, message: 'Check-in time updated successfully' };
        } catch (error) {
            throw new Error(`Failed to update check-in: ${error.message}`);
        }
    }

    // Update check-out time
    static async updateCheckOut(attendanceId, checkOutTime) {
        const query = `
            UPDATE attendances 
            SET check_out = ?, updated_at = NOW()
            WHERE attendance_id = ?
        `;
        
        try {
            const [result] = await pool.execute(query, [checkOutTime, attendanceId]);
            
            if (result.affectedRows === 0) {
                return { success: false, message: 'Attendance record not found' };
            }
            
            return { success: true, message: 'Check-out time updated successfully' };
        } catch (error) {
            throw new Error(`Failed to update check-out: ${error.message}`);
        }
    }

    // Delete attendance
    static async delete(attendanceId) {
        const query = `DELETE FROM attendances WHERE attendance_id = ?`;
        
        try {
            const [result] = await pool.execute(query, [attendanceId]);
            
            if (result.affectedRows === 0) {
                return { success: false, message: 'Attendance record not found' };
            }
            
            return { success: true, message: 'Attendance deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete attendance: ${error.message}`);
        }
    }

    // Mendapatkan attendance berdasarkan rentang tanggal
    static async findByDateRange(userId, startDate, endDate) {
        const query = `
            SELECT * FROM attendances 
            WHERE user_id = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
        `;
        
        try {
            const [rows] = await pool.execute(query, [userId, startDate, endDate]);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch attendance by date range: ${error.message}`);
        }
    }

    // Mendapatkan statistik attendance user
    static async getUserAttendanceStats(userId, month, year) {
        const query = `
            SELECT 
                status,
                COUNT(*) as count
            FROM attendances 
            WHERE user_id = ? 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
            GROUP BY status
        `;
        
        try {
            const [rows] = await pool.execute(query, [userId, month, year]);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch attendance stats: ${error.message}`);
        }
    }
}

export default AttendanceModel;