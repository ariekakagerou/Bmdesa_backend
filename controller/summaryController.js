import pool from '../config/db.js';

export const getSummary = async(req, res) => {
    try {
        const [userRows] = await pool.query('SELECT COUNT(*) AS total FROM users');
        const [productRows] = await pool.query('SELECT COUNT(*) AS total FROM products');
        const [transactionRows] = await pool.query('SELECT COUNT(*) AS total FROM transactions');
        const [reportRows] = await pool.query('SELECT COUNT(*) AS total FROM reports');

        // Dummy data
        const transactionMonths = ['Jan', 'Feb', 'Mar'];
        const transactionCounts = [5, 10, 8];
        const latestActivities = ['Login Admin', 'Tambah Produk', 'Edit Transaksi'];

        res.json({
            totalUsers: userRows[0].total,
            totalProducts: productRows[0].total,
            totalTransactions: transactionRows[0].total,
            totalReports: reportRows[0].total,
            transactionMonths,
            transactionCounts,
            latestActivities
        });
    } catch (err) {
        console.error('❌ Gagal ambil summary:', err);
        res.status(500).json({ message: 'Gagal mengambil data ringkasan' });
    }
};