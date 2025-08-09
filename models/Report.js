import db from '../config/db.js';

const Report = {
  async getByUnit(unit_id) {
    const [rows] = await db.execute('SELECT * FROM reports WHERE unit_id = ?', [unit_id]);
    return rows;
  },
  async getById(id) {
    const [rows] = await db.execute('SELECT * FROM reports WHERE report_id = ?', [id]);
    return rows[0];
  },
  async create({ unit_id, title, type, period, file_url, created_by }) {
    const [result] = await db.execute(
      'INSERT INTO reports (unit_id, title, type, period, file_url, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [unit_id, title, type, period, file_url, created_by]
    );
    return result.insertId;
  },
  async update(id, { title, type, period, file_url }) {
    const [result] = await db.execute(
      'UPDATE reports SET title=?, type=?, period=?, file_url=?, updated_at=NOW() WHERE report_id=?',
      [title, type, period, file_url, id]
    );
    return result;
  },
  async delete(id) {
    const [result] = await db.execute('DELETE FROM reports WHERE report_id=?', [id]);
    return result;
  }
};

export default Report;