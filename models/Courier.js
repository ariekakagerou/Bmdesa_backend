// models/Courier.js
import pool from '../config/db.js';

const Courier = {
  getAll: () => {
    return pool.query('SELECT * FROM couriers');
  },

  getById: (id) => {
    return pool.query('SELECT * FROM couriers WHERE courier_id = ?', [id]);
  },

  create: (data) => {
    const { name, service_type } = data;
    return pool.query(
      'INSERT INTO couriers (name, service_type) VALUES (?, ?)',
      [name, service_type]
    );
  },

  update: (id, data) => {
    const { name, service_type } = data;
    return pool.query(
      'UPDATE couriers SET name = ?, service_type = ? WHERE courier_id = ?',
      [name, service_type, id]
    );
  },

  delete: (id) => {
    return pool.query('DELETE FROM couriers WHERE courier_id = ?', [id]);
  },
};

export default Courier;
