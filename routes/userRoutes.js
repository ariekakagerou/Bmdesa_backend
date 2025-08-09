import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getUserByIdentifier } from '../controller/Usercontroller.js';
import authenticate from '../middleware/auth.js'; // Untuk verifikasi token JWT
import verifyAdmin from '../middleware/verifyAdmin.js'; // Untuk cek role admin
import { verifyMerchant } from '../controller/Usercontroller.js';

const router = express.Router(); // Menginisialisasi router

// Route untuk mendapatkan semua pengguna (hanya admin yang boleh mengakses)
router.get('/', authenticate, verifyAdmin, getAllUsers);

// Route untuk mendapatkan user berdasarkan identifier (email/phone/username)
router.get('/find', authenticate, getUserByIdentifier);

// Route untuk mendapatkan pengguna berdasarkan ID (semua role bisa mengakses, jika ID sesuai)
router.get('/:id', authenticate, getUserById);

// Route untuk update data pengguna (semua role bisa update data mereka sendiri)
router.put('/:id', authenticate, updateUser);

// Route untuk menghapus pengguna (hanya admin yang boleh menghapus pengguna)
router.delete('/:id', authenticate, verifyAdmin, deleteUser);

router.patch('/:id/verify-merchant', authenticate, verifyAdmin, verifyMerchant);

export default router;