import pool from '../config/db.js';

const TrackingLog = {
    async create({ shipment_id, status, location }) {
        try {
            const [result] = await pool.query(
                `INSERT INTO tracking_log (shipment_id, status, location, updated_at)
                 VALUES (?, ?, ?, NOW())`, [shipment_id, status, location]
            );
            return { tracking_id: result.insertId, shipment_id, status, location };
        } catch (err) {
            console.error('Error creating tracking log:', err);
            throw err;
        }
    },

    async getByShipmentId(shipment_id) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM tracking_log WHERE shipment_id = ? ORDER BY updated_at DESC`, [shipment_id]
            );
            return rows;
        } catch (err) {
            console.error('Error getting tracking logs:', err);
            throw err;
        }
    },

    async getAll() {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM tracking_log ORDER BY updated_at DESC`
            );
            return rows;
        } catch (err) {
            console.error('Error getting all tracking logs:', err);
            throw err;
        }
    }
};

export default TrackingLog;