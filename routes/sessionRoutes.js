import express from 'express';
import SessionController from '../controller/SessionController.js';

const router = express.Router();

// Validasi input
const validateSessionInput = (req, res, next) => {
  const { user_id, payload } = req.body;

  if (req.method === 'POST') {
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id wajib diisi'
      });
    }
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'payload wajib diisi'
      });
    }
  }

  next();
};

// Validasi ID param
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID harus berupa angka'
    });
  }
  next();
};

// Routes
router.get('/', SessionController.getAllSessions);
router.get('/cleanup', SessionController.cleanupExpiredSessions);
router.get('/:id', validateIdParam, SessionController.getSessionById);
router.post('/', validateSessionInput, SessionController.createSession);
router.put('/:id', validateIdParam, SessionController.updateSession);
// PATCH activity dihapus / atau arahkan ke updateSession
// router.patch('/:id/activity', validateIdParam, SessionController.updateSession);
router.delete('/:id', validateIdParam, SessionController.deleteSession);
router.get('/user/:user_id', SessionController.getSessionsByUserId);
router.delete('/user/:user_id', SessionController.deleteUserSessions);

// Error handler fallback
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

router.use((error, req, res, next) => {
  console.error('Session Route Error:', error);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

export default router;
