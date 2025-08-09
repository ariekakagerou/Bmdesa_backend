import express from 'express';
import {
    createNotification,
    getNotificationsByUser,
    markNotificationAsRead,
    deleteNotification
} from '../controller/NotificationController.js';

const router = express.Router();

// Buat notifikasi baru
router.post('/', createNotification);

// Ambil semua notifikasi user
router.get('/:user_id', getNotificationsByUser);

// Tandai notifikasi sudah dibaca
router.put('/read/:notification_id', markNotificationAsRead);

// Hapus notifikasi
router.delete('/:notification_id', deleteNotification);

export default router;