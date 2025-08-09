import pool from '../config/db.js';
import { hashPassword } from '../utils/auth.js';

class User {
    // Membuat pengguna baru
    static async create({
        name,
        username,
        jenis_kelamin,
        tanggal_lahir,
        email,
        google_id = null,
        password,
        phone = '',
        foto_profil = null,
        address = 'Belum diisi',
        role,
        status = 'inactive',
        email_verified_at = null,
        remember_token = null,
        nomor_rekening = null,
        kontak_darurat = null,
        siup_nib = '',
        nama_usaha = '',
        jenis_produk_layanan = '',
        alamat_usaha = ''
    }) {
        try {
            const hashedPassword = await hashPassword(password);
            const [result] = await pool.execute(
                `INSERT INTO users
                (name, username, jenis_kelamin, tanggal_lahir, email, google_id, password, phone, foto_profil, address, role, status, email_verified_at, remember_token, nomor_rekening, kontak_darurat, siup_nib, nama_usaha, jenis_produk_layanan, alamat_usaha)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [name, username, jenis_kelamin, tanggal_lahir, email, google_id, hashedPassword, phone, foto_profil, address, role, status, email_verified_at, remember_token, nomor_rekening, kontak_darurat, siup_nib, nama_usaha, jenis_produk_layanan, alamat_usaha]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error while creating user:', err.message);
            throw new Error('Failed to create user');
        }
    }

    // Cari user berdasarkan email
    static async findByEmail(email) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while finding user by email:', err.message);
            throw new Error('Failed to find user');
        }
    }

    // Cari user berdasarkan ID (primary key)
    static async findById(userId) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while finding user by ID:', err.message);
            throw new Error('Failed to find user by ID');
        }
    }

    // Update data user
    static async update(userId, {
        name,
        phone,
        address,
        foto_profil,
        tanggal_lahir,
        jenis_kelamin,
        bio_users = null,
        nomor_rekening = null,
        kontak_darurat = null,
        siup_nib = '',
        nama_usaha = '',
        jenis_produk_layanan = '',
        alamat_usaha = ''
    }) {
        try {
            await pool.execute(
                `UPDATE users SET 
                name = ?, phone = ?, address = ?, foto_profil = ?, tanggal_lahir = ?, jenis_kelamin = ?, 
                bio_users = ?, nomor_rekening = ?, kontak_darurat = ?, siup_nib = ?, nama_usaha = ?, 
                jenis_produk_layanan = ?, alamat_usaha = ?, updated_at = NOW()
                WHERE id = ?`, 
                [name, phone, address, foto_profil, tanggal_lahir, jenis_kelamin, bio_users, 
                 nomor_rekening, kontak_darurat, siup_nib, nama_usaha, jenis_produk_layanan, 
                 alamat_usaha, userId]
            );
        } catch (err) {
            console.error('Error while updating user:', err.message);
            throw new Error('Failed to update user');
        }
    }

    // Update password
    static async updatePassword(userId, newPassword) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            await pool.execute(
                `UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?`, [hashedPassword, userId]
            );
        } catch (err) {
            console.error('Error while updating password:', err.message);
            throw new Error('Failed to update password');
        }
    }

    // Update OTP (untuk verifikasi email atau login)
    static async updateOtp(userId, otpCode, otpExpiry) {
        try {
            await pool.execute(
                `UPDATE users SET otp_code = ?, otp_expiry = ?, updated_at = NOW() WHERE id = ?`, [otpCode, otpExpiry, userId]
            );
        } catch (err) {
            console.error('Error while updating OTP:', err.message);
            throw new Error('Failed to update OTP');
        }
    }

    // Verifikasi pengguna
    static async verifyUser(userId) {
        try {
            await pool.execute(
                `UPDATE users SET status = 'verify', otp_code = NULL, otp_expiry = NULL, updated_at = NOW() WHERE id = ?`, [userId]
            );
        } catch (err) {
            console.error('Error while verifying user:', err.message);
            throw new Error('Failed to verify user');
        }
    }

    // Ambil semua pengguna
    static async getAll(role = null) {
        try {
            let query = `SELECT id, users_id, name, username, email, phone, role, status, foto_profil, address FROM users`;
            const params = [];

            if (role) {
                query += ` WHERE role = ?`;
                params.push(role);
            }

            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (err) {
            console.error('Error while getting users:', err.message);
            throw new Error('Failed to retrieve users');
        }
    }

    // Hapus user
    static async delete(userId) {
        try {
            await pool.execute(`DELETE FROM users WHERE id = ?`, [userId]);
        } catch (err) {
            console.error('Error while deleting user:', err.message);
            throw new Error('Failed to delete user');
        }
    }

    // Cari user berdasarkan email, phone, atau username
    static async findByIdentifier(identifier) {
        try {
            const [rows] = await pool.execute(
                `SELECT * FROM users WHERE email = ? OR phone = ? OR username = ? LIMIT 1`,
                [identifier, identifier, identifier]
            );
            return rows[0] || null;
        } catch (err) {
            console.error('Error while finding user by identifier:', err.message);
            throw new Error('Failed to find user by identifier');
        }
    }

    // Cari user berdasarkan kolom id (primary key)
    static async findByIdRaw(id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while finding user by id (raw):', err.message);
            throw new Error('Failed to find user by id (raw)');
        }
    }

    // Cari user berdasarkan kolom users_id
    static async findByUsersId(usersId) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM users WHERE users_id = ?`, [usersId]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while finding user by users_id:', err.message);
            throw new Error('Failed to find user by users_id');
        }
    }
}

export default User;