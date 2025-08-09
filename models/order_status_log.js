import pool from '../config/db.js';

const OrderStatusLog = {
    getAll: () => pool.query('SELECT * FROM order_status_logs'),
    getById: (id) => pool.query('SELECT * FROM order_status_logs WHERE id = ?', [id]),
    create: (data) => {
        const { transaction_id, status, timestamp } = data;
        return pool.query(
            'INSERT INTO order_status_logs (transaction_id, status, timestamp) VALUES (?, ?, ?)', [transaction_id, status, timestamp]
        );
    },
    update: (id, data) => {
        const { transaction_id, status, timestamp } = data;
        return pool.query(
            'UPDATE order_status_logs SET transaction_id = ?, status = ?, timestamp = ? WHERE id = ?', [transaction_id, status, timestamp, id]
        );
    },
    delete: (id) => pool.query('DELETE FROM order_status_logs WHERE id = ?', [id]),
};

export default OrderStatusLog;