import express from 'express';
import PaymentController from '../controller/PaymentController.js';

const router = express.Router();

router.get('/', PaymentController.index);
router.post('/', PaymentController.store);
router.get('/:id', PaymentController.show);
router.put('/:id', PaymentController.update);
router.delete('/:id', PaymentController.destroy);

export default router;