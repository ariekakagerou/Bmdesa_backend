// models/PublicComplaint.js
import db from '../config/db.js';

class PublicComplaint {
    // Membuat pengaduan baru
    static async create({ user_id, subject, message }) {
        try {
            const [result] = await db.query(`
                INSERT INTO public_complaints (user_id, subject, message, status, submitted_at)
                VALUES (?, ?, ?, 'pending', current_timestamp())
            `, [user_id, subject, message]);
            return result.insertId;
        } catch (err) {
            console.error('Error while creating complaint:', err.message);
            throw new Error('Failed to create complaint');
        }
    }

    // Mengambil semua pengaduan
    static async getAll() {
        try {
            const [rows] = await db.query(`SELECT * FROM public_complaints`);
            return rows;
        } catch (err) {
            console.error('Error while getting complaints:', err.message);
            throw new Error('Failed to get complaints');
        }
    }

    // Mengambil pengaduan berdasarkan ID
    static async getById(complaint_id) {
        try {
            const [rows] = await db.query(`SELECT * FROM public_complaints WHERE complaint_id = ?`, [complaint_id]);
            return rows[0] || null;
        } catch (err) {
            console.error('Error while getting complaint by ID:', err.message);
            throw new Error('Failed to get complaint by ID');
        }
    }

    // Memperbarui status pengaduan
    static async updateStatus(complaint_id, status, response) {
        try {
            await db.query(`
                UPDATE public_complaints
                SET status = ?, response = ?, responded_at = current_timestamp()
                WHERE complaint_id = ?
            `, [status, response, complaint_id]);
        } catch (err) {
            console.error('Error while updating complaint status:', err.message);
            throw new Error('Failed to update complaint status');
        }
    }
}

export default PublicComplaint;