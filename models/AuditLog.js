import pool from '../config/db.js';

const AuditLog = {
  async logActivity({ userId, action, tableName, recordId, description }) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO audit_logs (user_id, action, table_name, record_id, description, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [userId, action, tableName, recordId, description]
      );
      return { id: result.insertId, userId, action, tableName, recordId, description };
    } catch (error) {
      console.error('❌ Error creating audit log:', error);
      throw error;
    }
  },

  async findAndCountAll({ order = [['created_at', 'DESC']], limit = 50, offset = 0 }) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [countResult] = await pool.query(`SELECT COUNT(*) as count FROM audit_logs`);
      return { rows, count: countResult[0].count };
    } catch (error) {
      console.error('❌ Error fetching audit logs:', error);
      throw error;
    }
  },

  async findByPk(id) {
    const [rows] = await pool.execute(`SELECT * FROM audit_logs WHERE audit_id = ?`, [id]);
    return rows[0] || null;
  },

  async getByUser(userId, limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  },

  async getByTable(tableName, recordId = null, limit = 50, offset = 0) {
    const query = recordId
      ? `SELECT * FROM audit_logs WHERE table_name = ? AND record_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
      : `SELECT * FROM audit_logs WHERE table_name = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    const params = recordId
      ? [tableName, recordId, limit, offset]
      : [tableName, limit, offset];

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  async count(whereClause = {}) {
    let query = `SELECT COUNT(*) AS count FROM audit_logs`;
    let values = [];

    if (whereClause.table_name) {
      query += ` WHERE table_name = ?`;
      values.push(whereClause.table_name);
    }

    if (whereClause.table_name && whereClause.record_id) {
      query += ` AND record_id = ?`;
      values.push(whereClause.record_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows[0]?.count || 0;
  }
};

export default AuditLog;
