// routes/paymentMethodRoutes.js
import express from 'express';
import PaymentMethodController from '../controller/PaymentMethodController.js';

const router = express.Router();

// Middleware untuk validasi ID parameter
const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter'
    });
  }

  next();
};

// Middleware untuk validasi request body saat create/update
const validatePaymentMethodData = (req, res, next) => {
  const { name, type } = req.body;
  const validTypes = ['transfer', 'e-wallet', 'QRIS', 'cash'];

  if (req.method === 'POST') {
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required'
      });
    }
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name must be a non-empty string'
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must not exceed 100 characters'
      });
    }
  }

  if (type !== undefined) {
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${validTypes.join(', ')}`
      });
    }
  }

  next();
};

// Routes
router.get('/types', PaymentMethodController.getPaymentMethodTypes);
router.get('/', PaymentMethodController.getAllPaymentMethods);
router.get('/:id', validateId, PaymentMethodController.getPaymentMethodById);
router.post('/', validatePaymentMethodData, PaymentMethodController.createPaymentMethod);
router.put('/:id', validateId, validatePaymentMethodData, PaymentMethodController.updatePaymentMethod);
router.delete('/:id', validateId, PaymentMethodController.deletePaymentMethod);

// ✅ export ESM
export default router;
