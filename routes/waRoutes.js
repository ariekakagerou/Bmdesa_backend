import express from 'express';
import { sendMessage } from '../utils/wa.js';

const router = express.Router();

const validatePhoneNumber = (number) => /^[0-9]{10,15}$/.test(number);

// Rute untuk mengirim pesan
router.post('/send-message', async(req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Nomor dan pesan wajib diisi' });
    }

    if (!validatePhoneNumber(number)) {
        return res.status(400).json({ error: 'Nomor tidak valid. Pastikan hanya angka 10–15 digit.' });
    }

    try {
        await wa.sendMessage(number, { text: message });
        res.json({ success: true, message: 'Pesan berhasil dikirim' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengirim pesan', details: err.message });
    }
});

export default router;