import express from 'express';
import AdminController from '../controller/AdminController.js'; // sesuaikan path
import authMiddleware from '../middleware/auth.js';   // sesuaikan path

const router = express.Router();
const adminController = new AdminController();

router.post('/login', adminController.login);
router.post('/logout', adminController.logout);

// Auth middleware
router.use(authMiddleware);

// CRUD routes
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.post('/', adminController.createAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

export default router;