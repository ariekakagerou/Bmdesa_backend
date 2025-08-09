import express from 'express';
import ReturnController from '../controller/ReturnController.js';

const router = express.Router();

// Middleware validasi data Return
const validateReturn = (req, res, next) => {
  const { transaction_id, user_id, reason } = req.body;

  if (!transaction_id || !user_id || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: transaction_id, user_id, reason'
    });
  }

  next();
};

// Routes Return
router.get('/', ReturnController.getAllReturns);
// router.get('/stats', ReturnController.getReturnStats); // Nonaktif dulu kalau belum ada di controller
router.get('/:id', ReturnController.getReturnById);
router.get('/user/:userId', ReturnController.getReturnsByUserId); // SESUAI DENGAN NAMA FUNCTION
router.post('/', validateReturn, ReturnController.createReturn);
router.put('/:id', ReturnController.updateReturnStatus);
router.patch('/:id', ReturnController.updateReturnStatus);
router.delete('/:id', ReturnController.deleteReturn);

export default router;
