import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_bumdes_semplak_barat',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 50000,
});

// Cek koneksi
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Berhasil terhubung ke database MySQL.');
        await connection.ping(); // Verifikasi koneksi
        connection.release(); // Kembalikan koneksi ke pool
    } catch (err) {
        console.error('❌ Gagal terhubung ke database MySQL.', err);
        process.exit(1);
    }
}

checkConnection();

export default pool;