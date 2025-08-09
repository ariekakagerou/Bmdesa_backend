import express from 'express';
import {
    applyForMerchant,
    getMerchantStatus,
    getAllMerchantApplications,
    processMerchantApplication,
    getMerchantProfile,
    updateMerchantProfile
} from '../controller/MerchantController.js';
import authenticate from '../middleware/auth.js';
import { validateMerchantApplication } from '../middleware/validation.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// User merchant routes
router.post('/apply', authenticate, validateMerchantApplication, applyForMerchant);
router.get('/status', authenticate, getMerchantStatus);
router.get('/profile', authenticate, getMerchantProfile);
router.put('/profile', authenticate, updateMerchantProfile);

// Admin routes for managing merchant applications
router.get('/applications', authenticate, checkRole(['admin']), getAllMerchantApplications);
router.post('/process', authenticate, checkRole(['admin']), processMerchantApplication);

export default router;
