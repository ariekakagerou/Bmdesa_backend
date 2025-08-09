import express from 'express';
import verificationController from '../controller/VerificationController.js'; // pastikan file ini juga pakai `export default`

const router = express.Router();

// Route untuk membuat kode verifikasi baru
router.post('/create', verificationController.createVerification);

// Route untuk memverifikasi kode
router.post('/verify', verificationController.verifyCode);

// Route untuk mendapatkan semua data verifikasi (untuk admin)
router.get('/all', verificationController.getAllVerifications);

// Route untuk mendapatkan verifikasi berdasarkan ID
router.get('/:id', verificationController.getVerificationById);

// Route untuk mendapatkan verifikasi berdasarkan identifier
router.get('/identifier/:identifier', verificationController.getVerificationByIdentifier);

// Route untuk menghapus verifikasi
router.delete('/:id', verificationController.deleteVerification);

// Route untuk update status verifikasi
router.put('/:id/status', verificationController.updateVerificationStatus);

// ✅ Export default agar bisa diimport dengan ESM
export default router;
