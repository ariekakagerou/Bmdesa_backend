// controllers/LeaveRequestController.js
import LeaveRequest from '../models/LeaveRequest.js';

export const createLeaveRequest = async(req, res) => {
    const { userId, leaveDate, reason, status = 'pending' } = req.body;

    try {
        const result = await LeaveRequest.createLeaveRequest(userId, leaveDate, reason, status);
        res.status(201).json({ success: true, message: 'Permohonan cuti berhasil dibuat', requestId: result.insertId });
    } catch (error) {
        console.error('Error creating leave request:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat permohonan cuti', error: error.message });
    }
};

export const getLeaveRequests = async(req, res) => {
    const { userId } = req.params;

    try {
        const requests = await LeaveRequest.getLeaveRequestsByUserId(userId);
        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: 'Permohonan cuti tidak ditemukan' });
        }
        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil permohonan cuti', error: error.message });
    }
};

export const updateLeaveRequest = async(req, res) => {
    const { requestId } = req.params;
    const { reason, status } = req.body;

    try {
        const result = await LeaveRequest.updateLeaveRequest(requestId, reason, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Permohonan cuti tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Permohonan cuti berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui permohonan cuti', error: error.message });
    }
};

export const deleteLeaveRequest = async(req, res) => {
    const { requestId } = req.params;

    try {
        const result = await LeaveRequest.deleteLeaveRequest(requestId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Permohonan cuti tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Permohonan cuti berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus permohonan cuti', error: error.message });
    }
};