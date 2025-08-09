// models/Invoice.js
import pool from '../config/db.js';

const Invoice = {
  async create(data) {
    const [result] = await pool.execute(
      'INSERT INTO invoices (transaction_id, file_url, created_at) VALUES (?, ?, ?)',
      [data.transaction_id, data.file_url || null, data.created_at || new Date()]
    );
    return { id: result.insertId, ...data };
  },

  async findByPk(id) {
    const [rows] = await pool.execute('SELECT * FROM invoices WHERE invoice_id = ?', [id]);
    return rows[0];
  },

  async findAndCountAll({ limit, offset, where }) {
    let query = 'SELECT * FROM invoices';
    let countQuery = 'SELECT COUNT(*) as count FROM invoices';
    let params = [];

    if (where && where.transaction_id) {
      query += ' WHERE transaction_id = ?';
      countQuery += ' WHERE transaction_id = ?';
      params.push(where.transaction_id);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [dataRows] = await pool.execute(query, params);
    const [countRows] = await pool.execute(countQuery, params.slice(0, params.length - 2));

    return { rows: dataRows, count: countRows[0].count };
  },

  async findAll({ where }) {
    let query = 'SELECT * FROM invoices';
    const params = [];

    if (where?.transaction_id) {
      query += ' WHERE transaction_id = ?';
      params.push(where.transaction_id);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.transaction_id !== undefined) {
      fields.push('transaction_id = ?');
      values.push(updateData.transaction_id);
    }
    if (updateData.file_url !== undefined) {
      fields.push('file_url = ?');
      values.push(updateData.file_url);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute(`UPDATE invoices SET ${fields.join(', ')} WHERE invoice_id = ?`, values);
    return result.affectedRows > 0;
  },

  async destroy(id) {
    const [result] = await pool.execute('DELETE FROM invoices WHERE invoice_id = ?', [id]);
    return result.affectedRows > 0;
  }
};

export default Invoice;
