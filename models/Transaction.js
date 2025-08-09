import pool from '../config/db.js';
import moment from 'moment';

const Transaction = {
    getRecent: async(limit = 50) => {
        const [rows] = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT ?', [limit]);
        return rows;
    },

    getById: async(id) => {
        const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
        return rows[0];
    },

    create: async(data) => {
        const {
            user_id,
            type,
            items,
            total_price,
            status,
            payment_method,
            payment_proof,
            notes,
            bank_name,
            bank_account_number,
            transfer_deadline,
            e_wallet_name,
            e_wallet_number
        } = data;

        const [result] = await pool.query(
            `INSERT INTO transactions (
                user_id, type, items, total_price, status, payment_method, 
                payment_proof, notes, bank_name, bank_account_number, 
                transfer_deadline, e_wallet_name, e_wallet_number, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                user_id,
                type,
                JSON.stringify(items),
                total_price,
                status,
                payment_method,
                payment_proof,
                notes,
                bank_name,
                bank_account_number,
                transfer_deadline,
                e_wallet_name,
                e_wallet_number,
                moment().format('YYYY-MM-DD HH:mm:ss')
            ]
        );

        return result.insertId;
    },

    updateStatus: async(id, status, payment_proof = null) => {
        await pool.query(
            'UPDATE transactions SET status = ?, payment_proof = ? WHERE id = ?', [status, payment_proof, id]
        );
    }
};

export default Transaction;