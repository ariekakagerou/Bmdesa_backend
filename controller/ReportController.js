import Report from '../models/Report.js';

// GET all reports (filtered by unit_id)
export const getAllReports = async(req, res) => {
    try {
        const unitId = req.query.unit_id;

        if (!unitId) {
            return res.status(400).json({ message: 'unit_id dibutuhkan untuk mengambil laporan.' });
        }

        const reports = await Report.getByUnit(unitId);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE report
export const createReport = async(req, res) => {
    try {
        const { unit_id, title, type, period, file_url } = req.body;
        const created_by = req.user ? req.user.user_id || 1 : 1;

        if (!title || !type || !period) {
            return res.status(400).json({ message: 'Field wajib (title, type, period) tidak boleh kosong.' });
        }

        const reportId = await Report.create({ unit_id, title, type, period, file_url, created_by });
        const newReport = await Report.getById(reportId);
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET report by ID
export const getReportById = async(req, res) => {
    try {
        const report = await Report.getById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE report
export const updateReport = async(req, res) => {
    try {
        const result = await Report.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        }

        const updatedReport = await Report.getById(req.params.id);
        res.json({ message: 'Laporan berhasil diperbarui.', data: updatedReport });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE report
export const deleteReport = async(req, res) => {
    try {
        const result = await Report.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        }
        res.json({ message: 'Laporan berhasil dihapus.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};