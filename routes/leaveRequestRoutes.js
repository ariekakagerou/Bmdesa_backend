// routes/leaveRequestRoutes.js
import express from 'express';
import {
    createLeaveRequest,
    getLeaveRequests,
    updateLeaveRequest,
    deleteLeaveRequest
} from '../controller/LeaveRequestController.js';

const router = express.Router();

// Route untuk membuat permohonan cuti
router.post('/', createLeaveRequest);

// Route untuk mendapatkan permohonan cuti berdasarkan userId
router.get('/:userId', getLeaveRequests);

// Route untuk memperbarui permohonan cuti
router.put('/:requestId', updateLeaveRequest);

// Route untuk menghapus permohonan cuti
router.delete('/:requestId', deleteLeaveRequest);

export default router;