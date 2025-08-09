import express from 'express';
const router = express.Router();

import {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
} from '../controller/reportController.js';

import authenticate from '../middleware/auth.js';

// Route untuk membuat laporan baru
router.post('/', authenticate, createReport);

// Route untuk mendapatkan semua laporan
router.get('/', authenticate, getAllReports);

// Route untuk mendapatkan laporan berdasarkan ID
router.get('/:id', authenticate, getReportById);

// Route untuk update laporan
router.put('/:id', authenticate, updateReport);

// Route untuk menghapus laporan
router.delete('/:id', authenticate, deleteReport);

export default router;