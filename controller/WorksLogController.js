// controllers/WorksLogController.js
import WorksLog from '../models/WorksLog.js';

export const createLog = async(req, res) => {
    const { user_id, date, activity } = req.body;

    try {
        const result = await WorksLog.createLog(user_id, date, activity);
        res.status(201).json({ success: true, message: 'Log aktivitas berhasil dibuat', log_id: result.insertId });
    } catch (error) {
        console.error('Error creating log:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat log aktivitas', error: error.message });
    }
};

export const getLogs = async(req, res) => {
    const { userId } = req.params;

    try {
        const logs = await WorksLog.getLogsByUserId(userId);
        if (logs.length === 0) {
            return res.status(404).json({ success: false, message: 'Log aktivitas tidak ditemukan' });
        }
        res.status(200).json({ success: true, logs });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil log aktivitas', error: error.message });
    }
};

export const updateLog = async(req, res) => {
    const { logId } = req.params;
    const { activity } = req.body;

    try {
        const result = await WorksLog.updateLog(logId, activity);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Log aktivitas tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Log aktivitas berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating log:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui log aktivitas', error: error.message });
    }
};

export const deleteLog = async(req, res) => {
    const { logId } = req.params;

    try {
        const result = await WorksLog.deleteLog(logId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Log aktivitas tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Log aktivitas berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting log:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus log aktivitas', error: error.message });
    }
};