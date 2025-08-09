import pool from '../config/db.js';

class Category {
  static async create({ name, description }) {
    const [result] = await pool.execute(
      'INSERT INTO Categories (name, description) VALUES (?, ?)', [name, description]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM Categories ORDER BY name');
    return rows;
  }

  static async getById(categoryId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Categories WHERE category_id = ?', [categoryId]
    );
    return rows[0];
  }

  static async update(categoryId, { name, description }) {
    await pool.execute(
      'UPDATE Categories SET name = ?, description = ? WHERE category_id = ?', [name, description, categoryId]
    );
  }

  static async delete(categoryId) {
    await pool.execute('DELETE FROM Categories WHERE category_id = ?', [categoryId]);
  }

  static async assignToProduct(productId, categoryId) {
    await pool.execute(
      'INSERT INTO ProductCategories (product_id, category_id) VALUES (?, ?)', [productId, categoryId]
    );
  }

  static async getProductCategories(productId) {
    const [rows] = await pool.execute(
      `SELECT c.* FROM Categories c
       JOIN ProductCategories pc ON c.category_id = pc.category_id
       WHERE pc.product_id = ?`, [productId]
    );
    return rows;
  }
}

export default Category;
