import db from '../config/db.js'; // gunakan ekstensi .js karena ES Module

class Faq {
  constructor(faq_id, question, answer, category) {
    this.faq_id = faq_id;
    this.question = question;
    this.answer = answer;
    this.category = category;
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM faq ORDER BY faq_id ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM faq WHERE faq_id = ?', [id]);
    return rows[0];
  }

  static async getByCategory(category) {
    const [rows] = await db.execute(
      'SELECT * FROM faq WHERE category = ? ORDER BY faq_id ASC',
      [category]
    );
    return rows;
  }

  static async create({ question, answer, category }) {
    const [result] = await db.execute(
      'INSERT INTO faq (question, answer, category) VALUES (?, ?, ?)',
      [question, answer, category]
    );
    return result.insertId;
  }

  static async update(id, { question, answer, category }) {
    const [result] = await db.execute(
      'UPDATE faq SET question = ?, answer = ?, category = ? WHERE faq_id = ?',
      [question, answer, category, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM faq WHERE faq_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(keyword) {
    const term = `%${keyword}%`;
    const [rows] = await db.execute(
      'SELECT * FROM faq WHERE question LIKE ? OR answer LIKE ? ORDER BY faq_id ASC',
      [term, term]
    );
    return rows;
  }

  static async getCategories() {
    const [rows] = await db.execute(
      'SELECT DISTINCT category FROM faq WHERE category IS NOT NULL ORDER BY category ASC'
    );
    return rows.map(row => row.category);
  }
}

export default Faq;
