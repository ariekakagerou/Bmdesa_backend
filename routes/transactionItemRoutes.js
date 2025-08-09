import express from 'express';
import TransactionItemController from '../controller/TransactionItemController.js'; // sesuaikan path jika perlu

const router = express.Router();

// GET - Mendapatkan semua transaction items
router.get('/', TransactionItemController.getAllTransactionItems);

// GET - Mendapatkan transaction item berdasarkan ID
router.get('/:id', TransactionItemController.getTransactionItemById);

// GET - Mendapatkan transaction items berdasarkan transaction_id
router.get('/transaction/:transactionId', TransactionItemController.getTransactionItemsByTransactionId);

// POST - Membuat transaction item baru
router.post('/', TransactionItemController.createTransactionItem);

// PUT - Update transaction item
router.put('/:id', TransactionItemController.updateTransactionItem);

// DELETE - Hapus transaction item
router.delete('/:id', TransactionItemController.deleteTransactionItem);

// ✅ Export default agar bisa digunakan dengan import
export default router;
