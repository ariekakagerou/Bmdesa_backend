// controller/AutoReplyController.js
import AutoReply from '../models/AutoReply.js';

// Membuat balasan otomatis baru
export const createAutoReply = async(req, res) => {
    const { user_id, context, reply_message } = req.body;

    if (!user_id || !context || !reply_message) {
        return res.status(400).json({ message: 'User ID, context, dan reply message wajib diisi.' });
    }

    try {
        const replyId = await AutoReply.create({ user_id, context, reply_message });
        res.status(201).json({ success: true, replyId });
    } catch (err) {
        console.error('Error creating auto reply:', err);
        res.status(500).json({ message: 'Gagal membuat balasan otomatis', error: err.message });
    }
};

// Mengambil semua balasan otomatis
export const getAllAutoReplies = async(req, res) => {
    try {
        const autoReplies = await AutoReply.getAll();
        res.status(200).json(autoReplies);
    } catch (err) {
        console.error('Error getting auto replies:', err);
        res.status(500).json({ message: 'Gagal mendapatkan balasan otomatis', error: err.message });
    }
};

// Mengambil balasan otomatis berdasarkan ID
export const getAutoReplyById = async(req, res) => {
    const { id } = req.params;

    try {
        const autoReply = await AutoReply.getById(id);
        if (!autoReply) {
            return res.status(404).json({ message: 'Balasan otomatis tidak ditemukan' });
        }
        res.status(200).json(autoReply);
    } catch (err) {
        console.error('Error getting auto reply by ID:', err);
        res.status(500).json({ message: 'Gagal mendapatkan balasan otomatis', error: err.message });
    }
};

// Memperbarui balasan otomatis
export const updateAutoReply = async(req, res) => {
    const { id } = req.params;
    const { context, reply_message } = req.body;

    if (!context || !reply_message) {
        return res.status(400).json({ message: 'Context dan reply message wajib diisi.' });
    }

    try {
        await AutoReply.update(id, { context, reply_message });
        res.status(200).json({ message: 'Balasan otomatis berhasil diperbarui' });
    } catch (err) {
        console.error('Error updating auto reply:', err);
        res.status(500).json({ message: 'Gagal memperbarui balasan otomatis', error: err.message });
    }
};

// Menghapus balasan otomatis
export const deleteAutoReply = async(req, res) => {
    const { id } = req.params;

    try {
        await AutoReply.delete(id);
        res.status(200).json({ message: 'Balasan otomatis berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting auto reply:', err);
        res.status(500).json({ message: 'Gagal menghapus balasan otomatis', error: err.message });
    }
};