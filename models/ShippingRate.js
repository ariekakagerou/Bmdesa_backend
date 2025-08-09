import pool from '../config/db.js';

class ShippingRate {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM shipping_rates ORDER BY rate_id DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM shipping_rates WHERE rate_id = ?', [id]);
    return rows[0] || null;
  }

  static async getByRoute(origin_city, destination_city) {
    const [rows] = await pool.query(
      'SELECT * FROM shipping_rates WHERE origin_city = ? AND destination_city = ?',
      [origin_city, destination_city]
    );
    return rows;
  }

  static async getByServiceId(service_id) {
    const [rows] = await pool.query('SELECT * FROM shipping_rates WHERE service_id = ?', [service_id]);
    return rows;
  }

  static async create({ origin_city, destination_city, rate, service_id }) {
    const [result] = await pool.query(
      'INSERT INTO shipping_rates (origin_city, destination_city, rate, service_id) VALUES (?, ?, ?, ?)',
      [origin_city, destination_city, rate, service_id]
    );
    return {
      rate_id: result.insertId,
      origin_city,
      destination_city,
      rate,
      service_id
    };
  }

  static async update(id, { origin_city, destination_city, rate, service_id }) {
    const [result] = await pool.query(
      'UPDATE shipping_rates SET origin_city = ?, destination_city = ?, rate = ?, service_id = ? WHERE rate_id = ?',
      [origin_city, destination_city, rate, service_id, id]
    );

    if (result.affectedRows === 0) return null;

    return await this.getById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM shipping_rates WHERE rate_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(term) {
    const [rows] = await pool.query(
      'SELECT * FROM shipping_rates WHERE origin_city LIKE ? OR destination_city LIKE ?',
      [`%${term}%`, `%${term}%`]
    );
    return rows;
  }

  static async getAvailableRoutes() {
    const [rows] = await pool.query(
      'SELECT DISTINCT origin_city, destination_city FROM shipping_rates ORDER BY origin_city, destination_city'
    );
    return rows;
  }
}

export default ShippingRate;
