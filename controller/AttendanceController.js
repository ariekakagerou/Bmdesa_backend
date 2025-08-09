// controllers/AttendanceController.js
import AttendanceModel from '../models/Attendance.js';
import { validationResult } from 'express-validator';

class AttendanceController {
    // Membuat attendance baru
    static async createAttendance(req, res) {
        try {
            // Validasi input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const { user_id, date, check_in, check_out, status, notes } = req.body;

            // Cek apakah sudah ada attendance untuk user dan tanggal tersebut
            const existingAttendance = await AttendanceModel.findByUserAndDate(user_id, date);
            if (existingAttendance.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Attendance record already exists for this date'
                });
            }

            const result = await AttendanceModel.create({
                user_id,
                date,
                check_in,
                check_out,
                status,
                notes
            });

            res.status(201).json({
                success: true,
                message: result.message,
                data: {
                    attendance_id: result.insertId,
                    user_id,
                    date,
                    check_in,
                    check_out,
                    status,
                    notes
                }
            });

        } catch (error) {
            console.error('Error creating attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan attendance berdasarkan ID
    static async getAttendanceById(req, res) {
        try {
            const { id } = req.params;

            const attendance = await AttendanceModel.findById(id);

            if (!attendance) {
                return res.status(404).json({
                    success: false,
                    message: 'Attendance record not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Attendance retrieved successfully',
                data: attendance
            });

        } catch (error) {
            console.error('Error fetching attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan attendance berdasarkan user_id dan date
    static async getAttendanceByUserAndDate(req, res) {
        try {
            const { userId, date } = req.params;

            const attendance = await AttendanceModel.findByUserAndDate(userId, date);

            res.status(200).json({
                success: true,
                message: 'Attendance retrieved successfully',
                data: attendance,
                count: attendance.length
            });

        } catch (error) {
            console.error('Error fetching attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan semua attendance user
    static async getUserAttendances(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 50 } = req.query;

            const offset = (page - 1) * limit;
            const attendances = await AttendanceModel.findByUserId(userId, parseInt(limit), offset);

            res.status(200).json({
                success: true,
                message: 'User attendances retrieved successfully',
                data: attendances,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    count: attendances.length
                }
            });

        } catch (error) {
            console.error('Error fetching user attendances:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan semua attendance
    static async getAllAttendances(req, res) {
        try {
            const { page = 1, limit = 50 } = req.query;

            const offset = (page - 1) * limit;
            const attendances = await AttendanceModel.findAll(parseInt(limit), offset);

            res.status(200).json({
                success: true,
                message: 'All attendances retrieved successfully',
                data: attendances,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    count: attendances.length
                }
            });

        } catch (error) {
            console.error('Error fetching all attendances:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update attendance
    static async updateAttendance(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { check_in, check_out, status, notes } = req.body;

            const result = await AttendanceModel.update(id, {
                check_in,
                check_out,
                status,
                notes
            });

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error('Error updating attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update check-in
    static async updateCheckIn(req, res) {
        try {
            const { id } = req.params;
            const { check_in } = req.body;

            if (!check_in) {
                return res.status(400).json({
                    success: false,
                    message: 'Check-in time is required'
                });
            }

            const result = await AttendanceModel.updateCheckIn(id, check_in);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error('Error updating check-in:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update check-out
    static async updateCheckOut(req, res) {
        try {
            const { id } = req.params;
            const { check_out } = req.body;

            if (!check_out) {
                return res.status(400).json({
                    success: false,
                    message: 'Check-out time is required'
                });
            }

            const result = await AttendanceModel.updateCheckOut(id, check_out);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error('Error updating check-out:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Delete attendance
    static async deleteAttendance(req, res) {
        try {
            const { id } = req.params;

            const result = await AttendanceModel.delete(id);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error('Error deleting attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan attendance berdasarkan rentang tanggal
    static async getAttendanceByDateRange(req, res) {
        try {
            const { userId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }

            const attendances = await AttendanceModel.findByDateRange(userId, startDate, endDate);

            res.status(200).json({
                success: true,
                message: 'Attendance retrieved successfully',
                data: attendances,
                count: attendances.length
            });

        } catch (error) {
            console.error('Error fetching attendance by date range:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan statistik attendance
    static async getAttendanceStats(req, res) {
        try {
            const { userId } = req.params;
            const { month, year } = req.query;

            if (!month || !year) {
                return res.status(400).json({
                    success: false,
                    message: 'Month and year are required'
                });
            }

            const stats = await AttendanceModel.getUserAttendanceStats(userId, month, year);

            res.status(200).json({
                success: true,
                message: 'Attendance statistics retrieved successfully',
                data: stats
            });

        } catch (error) {
            console.error('Error fetching attendance stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

export default AttendanceController;