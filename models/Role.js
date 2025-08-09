import pool from '../config/db.js';

class Role {
  static async findAll({ limit = 10, offset = 0, search = '', jenis = '' }) {
    let sql = `SELECT * FROM roles WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (jenis) {
      sql += ` AND jenis = ?`;
      params.push(jenis);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM roles WHERE 1=1`
      + (search ? ` AND (name LIKE '%${search}%' OR description LIKE '%${search}%')` : '')
      + (jenis ? ` AND jenis = '${jenis}'` : '')
    );

    return { rows, count: countRows[0].total };
  }

  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM roles WHERE role_id = ?`, [id]);
    return rows[0] || null;
  }

  static async findOneByName(name) {
    const [rows] = await pool.query(`SELECT * FROM roles WHERE name = ?`, [name]);
    return rows[0] || null;
  }

  static async findOneByNameExcludingId(name, id) {
    const [rows] = await pool.query(`SELECT * FROM roles WHERE name = ? AND role_id != ?`, [name, id]);
    return rows[0] || null;
  }

  static async findByJenis(jenis) {
    const [rows] = await pool.query(`SELECT * FROM roles WHERE jenis = ? ORDER BY name ASC`, [jenis]);
    return rows;
  }

  static async create(data) {
    const sql = `
      INSERT INTO roles (name, jenis, description, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    const [result] = await pool.query(sql, [data.name, data.jenis || null, data.description || null]);
    return result.insertId;
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    if (data.name) {
      fields.push('name = ?');
      params.push(data.name);
    }
    if (data.jenis !== undefined) {
      fields.push('jenis = ?');
      params.push(data.jenis);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      params.push(data.description);
    }

    fields.push('updated_at = NOW()');

    const sql = `UPDATE roles SET ${fields.join(', ')} WHERE role_id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM roles WHERE role_id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

export default Role;
