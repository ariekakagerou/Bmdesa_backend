// routes/worksLogRoutes.js
import express from 'express';
import {
    createLog,
    getLogs,
    updateLog,
    deleteLog
} from '../controller/WorksLogController.js';

const router = express.Router();

// Route untuk membuat log aktivitas
router.post('/', createLog);

// Route untuk mendapatkan log aktivitas berdasarkan userId
router.get('/:userId', getLogs);

// Route untuk memperbarui log aktivitas
router.put('/:logId', updateLog);

// Route untuk menghapus log aktivitas
router.delete('/:logId', deleteLog);

export default router;