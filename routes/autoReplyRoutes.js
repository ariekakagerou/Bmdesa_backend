// routes/autoReplyRoutes.js
import express from 'express';
import {
    createAutoReply,
    getAllAutoReplies,
    getAutoReplyById,
    updateAutoReply,
    deleteAutoReply
} from '../controller/AutoReplyController.js';

const router = express.Router();

// Endpoint untuk membuat balasan otomatis
router.post('/', createAutoReply);

// Endpoint untuk mendapatkan semua balasan otomatis
router.get('/', getAllAutoReplies);

// Endpoint untuk mendapatkan balasan otomatis berdasarkan ID
router.get('/:id', getAutoReplyById);

// Endpoint untuk memperbarui balasan otomatis
router.put('/:id', updateAutoReply);

// Endpoint untuk menghapus balasan otomatis
router.delete('/:id', deleteAutoReply);

export default router;