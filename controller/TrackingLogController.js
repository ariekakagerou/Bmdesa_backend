import TrackingLog from '../models/TrackingLog.js';

export const getAllTrackingLogs = async(req, res) => {
    try {
        const logs = await TrackingLog.getAll();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengambil data tracking log' });
    }
};

export const getTrackingLogsByShipment = async(req, res) => {
    try {
        const logs = await TrackingLog.getByShipmentId(req.params.shipment_id);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengambil data tracking log' });
    }
};

export const createTrackingLog = async(req, res) => {
    try {
        const { shipment_id, status, location } = req.body;
        if (!shipment_id || !status) {
            return res.status(400).json({ error: 'shipment_id dan status wajib diisi' });
        }
        const log = await TrackingLog.create({ shipment_id, status, location });
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: 'Gagal membuat tracking log' });
    }
};