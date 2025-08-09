import pool from '../config/db.js';

class Regulation {
  static async findAll({ limit = 10, offset = 0, whereClause = {}, search = '' }) {
    let sql = `SELECT * FROM regulations WHERE 1=1`;
    const params = [];

    if (whereClause.regulation_type) {
      sql += ` AND regulation_type = ?`;
      params.push(whereClause.regulation_type);
    }
    if (whereClause.status) {
      sql += ` AND status = ?`;
      params.push(whereClause.status);
    }
    if (search) {
      sql += ` AND (title LIKE ? OR regulation_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY date DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM regulations WHERE 1=1`
      + (whereClause.regulation_type ? ` AND regulation_type = '${whereClause.regulation_type}'` : '')
      + (whereClause.status ? ` AND status = '${whereClause.status}'` : '')
      + (search ? ` AND (title LIKE '%${search}%' OR regulation_number LIKE '%${search}%')` : '')
    );

    return { rows, count: countRows[0].total };
  }

  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM regulations WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async findByNumber(number) {
    const [rows] = await pool.query(`SELECT * FROM regulations WHERE regulation_number = ?`, [number]);
    return rows[0] || null;
  }

  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO regulations (regulation_type, regulation_number, title, date, status, file_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.regulation_type,
        data.regulation_number,
        data.title,
        data.date,
        data.status || 'diproses',
        data.file_url || null,
      ]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const updates = [];
    const params = [];

    if (data.regulation_type) {
      updates.push('regulation_type = ?');
      params.push(data.regulation_type);
    }
    if (data.regulation_number) {
      updates.push('regulation_number = ?');
      params.push(data.regulation_number);
    }
    if (data.title) {
      updates.push('title = ?');
      params.push(data.title);
    }
    if (data.date) {
      updates.push('date = ?');
      params.push(data.date);
    }
    if (data.status) {
      updates.push('status = ?');
      params.push(data.status);
    }
    if (data.file_url) {
      updates.push('file_url = ?');
      params.push(data.file_url);
    }

    if (updates.length === 0) return false;

    const sql = `UPDATE regulations SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM regulations WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

export default Regulation;
