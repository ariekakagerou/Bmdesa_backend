// routes/publicComplaintRoutes.js
import express from 'express';
import {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus
} from '../controller/PublicComplaintController.js';

const router = express.Router();

// Endpoint untuk membuat pengaduan
router.post('/', createComplaint);

// Endpoint untuk mendapatkan semua pengaduan
router.get('/', getAllComplaints);

// Endpoint untuk mendapatkan pengaduan berdasarkan ID
router.get('/:id', getComplaintById);

// Endpoint untuk memperbarui status pengaduan
router.put('/:id', updateComplaintStatus);

export default router;