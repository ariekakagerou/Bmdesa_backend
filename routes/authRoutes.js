// routes/authRoutes.js
import express from 'express';
import {
    register,
    login,
    verifyOtp,
    resendOtp,
    logout,
    registerWithGoogle,
    checkWhatsAppStatus,
    sendOtpManual,
    checkVerification,
    testEmail
} from '../controller/AuthController.js';
import authenticate from '../middleware/auth.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ===============================
// AUTHENTIKASI BUMDESA
// ===============================

// Test route
router.get('/', (req, res) => {
    res.status(200).send('Auth route is working');
});

// Cek status WhatsApp
router.get('/whatsapp-status', checkWhatsAppStatus);

// Cek verifikasi
router.get('/check-verification', checkVerification);

// Test email SMTP
router.post('/test-email', testEmail);

// Registrasi pengguna baru
router.post('/register', register);

// Kirim OTP manual
router.post('/send-otp', sendOtpManual);

// Verifikasi OTP
router.post('/verify-otp', verifyOtp);

// Kirim ulang OTP
router.post('/resend-otp', resendOtp);

// Login
router.post('/login', login);

// Logout (ubah status user jadi inactive)
router.post('/logout', logout);

// ===============================
// GOOGLE OAUTH2
// ===============================

// Arahkan ke Google untuk login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback setelah login Google berhasil
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('User authenticated:', req.user); // Log user
        if (!req.user) {
            return res.status(401).json({ message: 'Autentikasi Google gagal' });
        }

        const token = jwt.sign({
            user_id: req.user.user_id,
            name: req.user.name,
            role: req.user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login Google berhasil',
            token,
            user: req.user
        });
    }
);


// Registrasi pengguna baru dengan Google
router.post('/register-google', registerWithGoogle);


// ===============================
// PROFILE ROUTE (PROTECTED)
// ===============================

router.get('/profile', authenticate, (req, res) => {
    res.status(200).json({
        message: `Halo, ${req.user.name}. Ini profil kamu.`,
        user: req.user
    });
});

export default router;