import express from 'express';
import { getAllUserLogs, getUserLogsByUserId } from '../controller/UserLogController.js';
import authenticate from '../middleware/auth.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// Hanya admin yang bisa melihat semua log
router.get('/', authenticate, verifyAdmin, getAllUserLogs);

// Semua user bisa melihat log miliknya sendiri
router.get('/:user_id', authenticate, getUserLogsByUserId);

export default router;