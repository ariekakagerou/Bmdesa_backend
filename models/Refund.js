import db from '../config/db.js';

class Refund {
  constructor(data) {
    this.refund_id = data.refund_id;
    this.transaction_id = data.transaction_id;
    this.user_id = data.user_id;
    this.reason = data.reason;
    this.amount = data.amount;
    this.status = data.status || 'requested';
    this.created_at = data.created_at;
  }

  static async create(refundData) {
    const query = `
      INSERT INTO refunds (transaction_id, user_id, reason, amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      refundData.transaction_id,
      refundData.user_id,
      refundData.reason,
      refundData.amount,
      refundData.status
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  }

  static async findAll() {
    const query = `
      SELECT * FROM refunds ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows.map(row => new Refund(row));
  }

  static async findById(refundId) {
    const query = `
      SELECT * FROM refunds WHERE refund_id = ?
    `;
    const [rows] = await db.query(query, [refundId]);
    return rows.length ? new Refund(rows[0]) : null;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM refunds WHERE user_id = ? ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows.map(row => new Refund(row));
  }

  static async updateStatus(refundId, status) {
    const query = `
      UPDATE refunds SET status = ? WHERE refund_id = ?
    `;
    const [result] = await db.query(query, [status, refundId]);
    return result.affectedRows > 0;
  }

  static async deleteById(refundId) {
    const query = `
      DELETE FROM refunds WHERE refund_id = ?
    `;
    const [result] = await db.query(query, [refundId]);
    return result.affectedRows > 0;
  }

  static validateRefundData(data) {
    const errors = [];
    if (!data.transaction_id) errors.push('Transaction ID is required');
    if (!data.user_id) errors.push('User ID is required');
    if (!data.reason || data.reason.trim().length === 0) errors.push('Reason is required');
    if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0');
    if (data.status && !['requested', 'approved', 'rejected'].includes(data.status)) {
      errors.push('Status must be requested, approved, or rejected');
    }
    return errors;
  }
}

export default Refund;
