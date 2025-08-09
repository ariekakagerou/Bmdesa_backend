// routes/merchantProfileRoutes.js
import express from 'express';
import merchantProfileController from '../controller/MerchantProfileController.js';

const router = express.Router();

// GET all merchant profiles
router.get('/', merchantProfileController.getAllMerchants);

// GET merchant profile by ID
router.get('/:id', merchantProfileController.getMerchantById);

// POST create new merchant profile
router.post('/', merchantProfileController.createMerchant);

// PUT update merchant profile
router.put('/:id', merchantProfileController.updateMerchant);

// DELETE merchant profile
router.delete('/:id', merchantProfileController.deleteMerchant);

// GET merchants by store name (search)
router.get('/search/:storeName', merchantProfileController.getMerchantByStoreName);

export default router;
