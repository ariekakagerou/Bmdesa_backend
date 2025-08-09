// controller/PublicComplaintController.js
import PublicComplaint from '../models/PublicComplaint.js';

// Membuat pengaduan baru
export const createComplaint = async(req, res) => {
    const { user_id, subject, message } = req.body;

    if (!user_id || !subject || !message) {
        return res.status(400).json({ message: 'User ID, subject, dan message wajib diisi.' });
    }

    try {
        const complaintId = await PublicComplaint.create({ user_id, subject, message });
        res.status(201).json({ success: true, complaintId });
    } catch (err) {
        console.error('Error creating complaint:', err);
        res.status(500).json({ message: 'Gagal membuat pengaduan', error: err.message });
    }
};

// Mengambil semua pengaduan
export const getAllComplaints = async(req, res) => {
    try {
        const complaints = await PublicComplaint.getAll();
        res.status(200).json(complaints);
    } catch (err) {
        console.error('Error getting complaints:', err);
        res.status(500).json({ message: 'Gagal mendapatkan pengaduan', error: err.message });
    }
};

// Mengambil pengaduan berdasarkan ID
export const getComplaintById = async(req, res) => {
    const { id } = req.params;

    try {
        const complaint = await PublicComplaint.getById(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
        }
        res.status(200).json(complaint);
    } catch (err) {
        console.error('Error getting complaint by ID:', err);
        res.status(500).json({ message: 'Gagal mendapatkan pengaduan', error: err.message });
    }
};

// Memperbarui status pengaduan
export const updateComplaintStatus = async(req, res) => {
    const { id } = req.params;
    const { status, response } = req.body;

    if (!status || !response) {
        return res.status(400).json({ message: 'Status dan response wajib diisi.' });
    }

    try {
        await PublicComplaint.updateStatus(id, status, response);
        res.status(200).json({ message: 'Status pengaduan berhasil diperbarui' });
    } catch (err) {
        console.error('Error updating complaint status:', err);
        res.status(500).json({ message: 'Gagal memperbarui status pengaduan', error: err.message });
    }
};