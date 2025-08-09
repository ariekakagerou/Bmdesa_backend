// models/shipment.js
import pool from '../config/db.js'; // Pastikan koneksi DB benar

const Shipment = {
    getAll: async() => {
        try {
            const [rows] = await pool.query('SELECT * FROM shipments');
            return rows;
        } catch (error) {
            console.error('❌ Error getAll:', error);
            throw error;
        }
    },

    getById: async(id) => {
        try {
            const [rows] = await pool.query('SELECT * FROM shipments WHERE shipment_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('❌ Error getById:', error);
            throw error;
        }
    },

    create: async(data) => {
        try {
            const {
                transaction_id,
                shipping_address_id,
                courier_name,
                tracking_number,
                courier_service,
                status = 'pending',
                shipped_at = null,
                delivered_at = null,
                received_by_user = 0,
                courier_user_id = null
            } = data;

            const [result] = await pool.query(
                `INSERT INTO shipments (
                    transaction_id, shipping_address_id, courier_name,
                    tracking_number, courier_service, status,
                    shipped_at, delivered_at, received_by_user,
                    courier_user_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    transaction_id, shipping_address_id, courier_name,
                    tracking_number, courier_service, status,
                    shipped_at, delivered_at, received_by_user,
                    courier_user_id
                ]
            );

            return { shipment_id: result.insertId, ...data };
        } catch (error) {
            console.error('❌ Error create:', error);
            throw error;
        }
    },

    update: async(id, data) => {
        try {
            const {
                transaction_id,
                shipping_address_id,
                courier_name,
                tracking_number,
                courier_service,
                status,
                shipped_at,
                delivered_at,
                received_by_user,
                courier_user_id
            } = data;

            await pool.query(
                `UPDATE shipments SET
                    transaction_id = ?, shipping_address_id = ?, courier_name = ?,
                    tracking_number = ?, courier_service = ?, status = ?,
                    shipped_at = ?, delivered_at = ?, received_by_user = ?,
                    courier_user_id = ?
                 WHERE shipment_id = ?`, [
                    transaction_id, shipping_address_id, courier_name,
                    tracking_number, courier_service, status,
                    shipped_at, delivered_at, received_by_user,
                    courier_user_id, id
                ]
            );

            return { shipment_id: id, ...data };
        } catch (error) {
            console.error('❌ Error update:', error);
            throw error;
        }
    },

    delete: async(id) => {
        try {
            await pool.query('DELETE FROM shipments WHERE shipment_id = ?', [id]);
            return { message: `Shipment dengan ID ${id} berhasil dihapus.` };
        } catch (error) {
            console.error('❌ Error delete:', error);
            throw error;
        }
    }
};

export default Shipment;