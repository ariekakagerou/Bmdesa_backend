// routes/attendanceRoutes.js
import express from 'express';
import AttendanceController from '../controller/AttendanceController.js';
import {
    validateCreateAttendance,
    validateUpdateAttendance,
    validateAttendanceId,
    validateUserId,
    validateUserAndDate,
    validateDateRange,
    validateAttendanceStats,
    validatePagination,
    validateCheckIn,
    validateCheckOut
} from '../middleware/attendanceValidation.js';

const router = express.Router();

// CREATE - Membuat attendance baru
router.post('/',
    validateCreateAttendance,
    AttendanceController.createAttendance
);

// READ - Mendapatkan attendance berdasarkan ID
router.get('/detail/:id',
    validateAttendanceId,
    AttendanceController.getAttendanceById
);

// READ - Mendapatkan semua attendance dengan pagination
router.get('/',
    validatePagination,
    AttendanceController.getAllAttendances
);

// READ - Mendapatkan attendance berdasarkan user_id
router.get('/user/:userId',
    validateUserId,
    validatePagination,
    AttendanceController.getUserAttendances
);

// READ - Mendapatkan attendance berdasarkan user_id dan date
router.get('/user/:userId/date/:date',
    validateUserAndDate,
    AttendanceController.getAttendanceByUserAndDate
);

// READ - Mendapatkan attendance berdasarkan rentang tanggal
router.get('/user/:userId/range',
    validateDateRange,
    AttendanceController.getAttendanceByDateRange
);

// READ - Mendapatkan statistik attendance user
router.get('/user/:userId/stats',
    validateAttendanceStats,
    AttendanceController.getAttendanceStats
);

// UPDATE - Update attendance lengkap
router.put('/:id',
    validateUpdateAttendance,
    AttendanceController.updateAttendance
);

// UPDATE - Update check-in saja
router.patch('/:id/checkin',
    validateCheckIn,
    AttendanceController.updateCheckIn
);

// UPDATE - Update check-out saja
router.patch('/:id/checkout',
    validateCheckOut,
    AttendanceController.updateCheckOut
);

// DELETE - Hapus attendance
router.delete('/:id',
    validateAttendanceId,
    AttendanceController.deleteAttendance
);

export default router;