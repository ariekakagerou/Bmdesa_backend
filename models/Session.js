import pool from '../config/db.js';

class Session {
  static async create(data) {
    const sql = `
      INSERT INTO sessions (user_id, ip_address, user_agent, payload, last_activity)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      data.user_id,
      data.ip_address,
      data.user_agent,
      JSON.stringify(data.payload),
      Math.floor(Date.now() / 1000)
    ]);
    return result.insertId;
  }

  static async findAll({ limit = 10, offset = 0, user_id = null }) {
    let sql = `SELECT * FROM sessions WHERE 1=1`;
    const params = [];

    if (user_id) {
      sql += ` AND user_id = ?`;
      params.push(user_id);
    }

    sql += ` ORDER BY last_activity DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM sessions WHERE 1=1` + (user_id ? ` AND user_id = ${user_id}` : '')
    );

    return { rows, count: countRows[0].total };
  }

  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM sessions WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    if (data.payload !== undefined) {
      fields.push('payload = ?');
      params.push(JSON.stringify(data.payload));
    }
    if (data.ip_address !== undefined) {
      fields.push('ip_address = ?');
      params.push(data.ip_address);
    }
    if (data.user_agent !== undefined) {
      fields.push('user_agent = ?');
      params.push(data.user_agent);
    }

    fields.push('last_activity = ?');
    params.push(Math.floor(Date.now() / 1000));

    const sql = `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM sessions WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  static async findByUserId(user_id, active_only = false) {
    let sql = `SELECT * FROM sessions WHERE user_id = ?`;
    const params = [user_id];

    if (active_only) {
      const cutoff = Math.floor(Date.now() / 1000) - 7200; // 2 jam
      sql += ` AND last_activity >= ?`;
      params.push(cutoff);
    }

    sql += ` ORDER BY last_activity DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async cleanupExpired(max_lifetime) {
    const cutoff = Math.floor(Date.now() / 1000) - max_lifetime;
    const [result] = await pool.query(`DELETE FROM sessions WHERE last_activity < ?`, [cutoff]);
    return result.affectedRows;
  }

  static async deleteUserSessions(user_id, except_id = null) {
    let sql = `DELETE FROM sessions WHERE user_id = ?`;
    const params = [user_id];
    if (except_id) {
      sql += ` AND id != ?`;
      params.push(except_id);
    }
    const [result] = await pool.query(sql, params);
    return result.affectedRows;
  }
}

export default Session;
