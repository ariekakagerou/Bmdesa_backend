import pool from '../config/db.js';

class Return {
  static async create(data) {
    const sql = `
      INSERT INTO returns (transaction_id, user_id, reason, status, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.query(sql, [
      data.transaction_id,
      data.user_id,
      data.reason,
      data.status || 'pending'
    ]);
    return result.insertId;
  }

  static async findAll() {
    const sql = `SELECT * FROM returns ORDER BY created_at DESC`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM returns WHERE return_id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async findByUserId(userId) {
    const sql = `SELECT * FROM returns WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await pool.query(sql, [userId]);
    return rows;
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE returns SET status = ? WHERE return_id = ?`;
    const [result] = await pool.query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM returns WHERE return_id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }

  static validate(data) {
    const errors = [];
    if (!data.transaction_id) errors.push('Transaction ID is required');
    if (!data.user_id) errors.push('User ID is required');
    if (!data.reason || data.reason.trim() === '') errors.push('Reason is required');
    if (data.status && !['pending', 'approved', 'rejected'].includes(data.status)) {
      errors.push('Invalid status');
    }
    return errors;
  }
}

export default Return;
