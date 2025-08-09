import express from 'express';
import RefundController from '../controller/RefundController.js'; // pastikan path sesuai

const router = express.Router();

// Create a new refund request
router.post('/refunds', RefundController.createRefund);

// Get all refunds
router.get('/refunds', RefundController.getAllRefunds);

// Get refund by ID
router.get('/refunds/:id', RefundController.getRefundById);

// Get refunds by user ID
router.get('/users/:userId/refunds', RefundController.getRefundsByUserId);

// Update refund status
router.put('/refunds/:id/status', RefundController.updateRefundStatus);

// Delete refund
router.delete('/refunds/:id', RefundController.deleteRefund);

// ✅ Export default agar bisa di-import dengan syntax `import refundRoutes from ...`
export default router;
