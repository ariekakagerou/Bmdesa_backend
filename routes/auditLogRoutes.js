import express from 'express';
import AuditLogController from '../controller/AuditLogController.js';

const router = express.Router();

// Middleware untuk autentikasi (placeholder – sesuaikan dengan sistemmu)
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token diperlukan'
    });
  }
  // Di sini seharusnya token diverifikasi
  // req.user = { id: userId, role: 'admin' } // Contoh
  next();
};

// Middleware otorisasi admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses audit log'
    });
  }
};

// Route: Create log
router.post('/', authenticateToken, AuditLogController.createAuditLog);

// Route: Get all logs
router.get('/', authenticateToken, authorizeAdmin, AuditLogController.getAllAuditLogs);

// Route: Search
router.get('/search', authenticateToken, authorizeAdmin, AuditLogController.searchAuditLogs);

// Route: Get logs by user
router.get('/user/:userId', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id != req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'Anda hanya dapat melihat audit log Anda sendiri'
    });
  }
  next();
}, AuditLogController.getAuditLogsByUser);

// Route: Get logs by table
router.get('/table/:tableName', authenticateToken, authorizeAdmin, AuditLogController.getAuditLogsByTable);

// Route: Get log by ID
router.get('/:id', authenticateToken, authorizeAdmin, AuditLogController.getAuditLogById);

// Ekspor default router (agar bisa import auditLogRoutes from ...)
export default router;