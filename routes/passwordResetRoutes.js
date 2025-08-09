// routes/passwordResetRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import PasswordResetController from '../controller/PasswordResetController.js';

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules
const requestResetValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail()
];

const verifyResetValidation = [
  body('token').optional().isLength({ min: 1 }).withMessage('Token cannot be empty'),
  body('code').optional().isLength({ min: 6, max: 6 }).withMessage('Code must be exactly 6 digits'),
  body('email').optional().isEmail().withMessage('Please provide a valid email address').normalizeEmail()
];

const resetPasswordValidation = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ...verifyResetValidation
];

// Routes
router.post('/request', requestResetValidation, handleValidationErrors, PasswordResetController.requestReset);
router.post('/verify', verifyResetValidation, handleValidationErrors, PasswordResetController.verifyReset);
router.post('/reset', resetPasswordValidation, handleValidationErrors, PasswordResetController.resetPassword);
router.get('/all', PasswordResetController.getAllResets);
router.delete('/clean', PasswordResetController.cleanExpired);

// ✅ Ini bagian penting
export default router;
