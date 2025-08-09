import express from 'express';
import VoucherController from '../controller/VoucherController.js'; // pastikan ini menggunakan export default di file controllernya

const router = express.Router();

// GET all vouchers
router.get('/', VoucherController.getAllVouchers);
// GET voucher by id
router.get('/:id', VoucherController.getVoucherById);
// POST create voucher
router.post('/', VoucherController.createVoucher);
// PUT update voucher
router.put('/:id', VoucherController.updateVoucher);
// DELETE voucher
router.delete('/:id', VoucherController.deleteVoucher);

// ✅ Export default agar bisa digunakan oleh app.js
export default router;
