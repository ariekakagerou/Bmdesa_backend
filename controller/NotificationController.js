import Notification from '../models/Notification.js';

export const createNotification = async(req, res) => {
    const { user_id, message } = req.body;
    if (!user_id || !message) {
        return res.status(400).json({ message: 'user_id dan message wajib diisi.' });
    }
    try {
        const notificationId = await Notification.create({ user_id, message });
        res.status(201).json({ success: true, notificationId });
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat notifikasi', error: err.message });
    }
};

export const getNotificationsByUser = async(req, res) => {
    const { user_id } = req.params;
    try {
        const notifications = await Notification.getByUserId(user_id);
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil notifikasi', error: err.message });
    }
};

export const markNotificationAsRead = async(req, res) => {
    const { notification_id } = req.params;
    try {
        await Notification.markAsRead(notification_id);
        res.status(200).json({ success: true, message: 'Notifikasi ditandai sudah dibaca' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update status notifikasi', error: err.message });
    }
};

export const deleteNotification = async(req, res) => {
    const { notification_id } = req.params;
    try {
        await Notification.delete(notification_id);
        res.status(200).json({ success: true, message: 'Notifikasi dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menghapus notifikasi', error: err.message });
    }
};