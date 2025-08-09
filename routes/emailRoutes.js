import express from 'express';
import sendEmail from '../services/emailService.js';

const router = express.Router();

// POST /api/email/send
router.post('/send', async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await sendEmail(to, subject, text);
    res.status(200).json({ success: true, message: 'Email berhasil dikirim.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengirim email.', error: error.message });
  }
});

export default router;
