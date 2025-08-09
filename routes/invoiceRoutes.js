import express from 'express';
import { InvoiceController, upload } from '../controller/InvoiceController.js';
import multer from 'multer';

const router = express.Router();

// Middleware untuk validasi dan error handling
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File terlalu besar! Maksimal 5MB'
      });
    }
  }

  if (err.message === 'Hanya file gambar dan dokumen yang diizinkan!') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
};

// Routes untuk Invoice
router.get('/', InvoiceController.getAllInvoices);
router.get('/:id', InvoiceController.getInvoiceById);
router.get('/transaction/:transaction_id', InvoiceController.getInvoiceByTransactionId);

router.post(
  '/',
  upload.single('invoice_file'),
  handleMulterError,
  InvoiceController.createInvoice
);

router.put(
  '/:id',
  upload.single('invoice_file'),
  handleMulterError,
  InvoiceController.updateInvoice
);

router.delete('/:id', InvoiceController.deleteInvoice);

export default router;
