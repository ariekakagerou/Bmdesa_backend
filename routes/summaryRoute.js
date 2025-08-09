import express from 'express';
import { getSummary } from '../controller/summaryController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Route ringkasan data untuk dashboard
router.get('/summary', authenticate, getSummary);

export default router;