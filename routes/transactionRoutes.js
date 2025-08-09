import express from 'express';
import { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } from '../controller/TransactionController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Route untuk membuat transaksi baru
router.post('/', authenticate, createTransaction);

// Route untuk mendapatkan semua transaksi
router.get('/', authenticate, getAllTransactions);

// Route untuk mendapatkan transaksi berdasarkan ID
router.get('/:id', authenticate, getTransactionById);

// Route untuk update transaksi
router.put('/:id', authenticate, updateTransaction);

// Route untuk menghapus transaksi
router.delete('/:id', authenticate, deleteTransaction);

export default router;