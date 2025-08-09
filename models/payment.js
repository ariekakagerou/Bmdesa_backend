import pool from '../config/db.js';

const Payment = {
    getAll: () => {
        return pool.query('SELECT * FROM payments');
    },
    getById: (id) => {
        return pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    },
    create: (data) => {
        const { method, amount, status, transaction_id } = data;
        return pool.query(
            'INSERT INTO payments (method, amount, status, transaction_id) VALUES (?, ?, ?, ?)', [method, amount, status, transaction_id]
        );
    },
    update: (id, data) => {
        const { method, amount, status, transaction_id } = data;
        return pool.query(
            'UPDATE payments SET method = ?, amount = ?, status = ?, transaction_id = ? WHERE id = ?', [method, amount, status, transaction_id, id]
        );
    },
    delete: (id) => {
        return pool.query('DELETE FROM payments WHERE id = ?', [id]);
    },
};

export default Payment;