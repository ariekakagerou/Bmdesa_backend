import pool from '../config/db.js';

class Setting {
  static async findAll({ limit = 10, offset = 0, search = '', jenis = '' }) {
    let sql = `SELECT * FROM settings WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (nama LIKE ? OR setting_key LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (jenis) {
      sql += ` AND jenis = ?`;
      params.push(jenis);
    }

    sql += ` ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM settings WHERE 1=1`
      + (search ? ` AND (nama LIKE '%${search}%' OR setting_key LIKE '%${search}%')` : '')
      + (jenis ? ` AND jenis = '${jenis}'` : '')
    );

    return { rows, count: countRows[0].total };
  }

  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM settings WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async findByKey(key) {
    const [rows] = await pool.query(`SELECT * FROM settings WHERE setting_key = ?`, [key]);
    return rows[0] || null;
  }

  static async create(data) {
    const sql = `
      INSERT INTO settings (nama, jenis, penyimpanan, setting_key, setting_value, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.query(sql, [
      data.nama,
      data.jenis,
      data.penyimpanan || null,
      data.setting_key,
      data.setting_value || null
    ]);
    return result.insertId;
  }

  static async updateById(id, data) {
    const fields = [];
    const params = [];

    if (data.nama !== undefined) {
      fields.push('nama = ?');
      params.push(data.nama);
    }
    if (data.jenis !== undefined) {
      fields.push('jenis = ?');
      params.push(data.jenis);
    }
    if (data.penyimpanan !== undefined) {
      fields.push('penyimpanan = ?');
      params.push(data.penyimpanan);
    }
    if (data.setting_key !== undefined) {
      fields.push('setting_key = ?');
      params.push(data.setting_key);
    }
    if (data.setting_value !== undefined) {
      fields.push('setting_value = ?');
      params.push(data.setting_value);
    }

    fields.push('updated_at = NOW()');

    const sql = `UPDATE settings SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);
    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    const [result] = await pool.query(`DELETE FROM settings WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  static async updateByKey(key, data) {
    const fields = [];
    const params = [];

    if (data.nama !== undefined) {
      fields.push('nama = ?');
      params.push(data.nama);
    }
    if (data.jenis !== undefined) {
      fields.push('jenis = ?');
      params.push(data.jenis);
    }
    if (data.penyimpanan !== undefined) {
      fields.push('penyimpanan = ?');
      params.push(data.penyimpanan);
    }
    if (data.setting_value !== undefined) {
      fields.push('setting_value = ?');
      params.push(data.setting_value);
    }

    fields.push('updated_at = NOW()');

    const sql = `UPDATE settings SET ${fields.join(', ')} WHERE setting_key = ?`;
    params.push(key);

    const [result] = await pool.query(sql, params);
    return result.affectedRows > 0;
  }

  static async deleteByKey(key) {
    const [result] = await pool.query(`DELETE FROM settings WHERE setting_key = ?`, [key]);
    return result.affectedRows > 0;
  }

  static parseValue(row) {
    if (!row || !row.setting_value) return null;

    const { jenis, setting_value } = row;

    switch (jenis.toLowerCase()) {
      case 'number':
      case 'integer':
        return parseInt(setting_value);
      case 'float':
      case 'decimal':
        return parseFloat(setting_value);
      case 'boolean':
        return setting_value.toLowerCase() === 'true';
      case 'json':
        try { return JSON.parse(setting_value); } catch { return setting_value; }
      case 'array':
        try { return JSON.parse(setting_value); } catch { return setting_value.split(',').map(s => s.trim()); }
      default:
        return setting_value;
    }
  }
}

export default Setting;
