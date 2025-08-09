// routes/CourierRoutes.js
import express from 'express';
import CourierController from '../controller/CourierController.js';

const router = express.Router();

// Gunakan nama method yang sesuai
router.get('/', CourierController.getAllCouriers);
router.get('/:id', CourierController.getCourierById);
router.post('/', CourierController.createCourier);
router.put('/:id', CourierController.updateCourier);
router.delete('/:id', CourierController.deleteCourier);

export default router;
