import express from 'express';
import BusinessUnitController from '../controller/BusinessUnitController.js';
import { validateBusinessUnit } from '../middleware/validation.js';

const router = express.Router();

// Mendapatkan semua unit usaha
router.get('/', BusinessUnitController.getAllBusinessUnits);

// Menambahkan unit usaha baru dengan validasi
router.post('/', validateBusinessUnit, BusinessUnitController.addBusinessUnit);

export default router;