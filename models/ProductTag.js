// ProductTag.js - Model
import pool from '../config/db.js';

const ProductTag = {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM product_tags ORDER BY tag_id ASC');
        return rows;
    },

    async findByPk(id) {
        const [rows] = await pool.query('SELECT * FROM product_tags WHERE tag_id = ?', [id]);
        return rows[0] || null;
    },

    async findOneByName(name) {
        const [rows] = await pool.query('SELECT * FROM product_tags WHERE name = ?', [name]);
        return rows[0] || null;
    },

    async create({ name }) {
        const [result] = await pool.query('INSERT INTO product_tags (name) VALUES (?)', [name]);
        return { tag_id: result.insertId, name };
    },

    async update(id, { name }) {
        await pool.query('UPDATE product_tags SET name = ? WHERE tag_id = ?', [name, id]);
        return { tag_id: id, name };
    },

    async destroy(id) {
        await pool.query('DELETE FROM product_tags WHERE tag_id = ?', [id]);
        return true;
    },

    async searchByName(name) {
        const [rows] = await pool.query('SELECT * FROM product_tags WHERE name LIKE ? ORDER BY name ASC', [`%${name}%`]);
        return rows;
    }
};

export default ProductTag;