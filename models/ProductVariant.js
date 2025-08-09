import pool from '../config/db.js';

const ProductVariant = {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM product_variants ORDER BY variant_id ASC');
        return rows;
    },

    async findByPk(id) {
        const [rows] = await pool.query('SELECT * FROM product_variants WHERE variant_id = ?', [id]);
        return rows[0] || null;
    },

    async findByProductId(productId) {
        const [rows] = await pool.query(
            'SELECT * FROM product_variants WHERE product_id = ? ORDER BY variant_name ASC, variant_value ASC', [productId]
        );
        return rows;
    },

    async findOne({ product_id, variant_name, variant_value }) {
        const [rows] = await pool.query(
            'SELECT * FROM product_variants WHERE product_id = ? AND variant_name = ? AND variant_value = ?', [product_id, variant_name, variant_value]
        );
        return rows[0] || null;
    },

    async create({ product_id, variant_name, variant_value, stock, price }) {
        const [result] = await pool.query(
            'INSERT INTO product_variants (product_id, variant_name, variant_value, stock, price) VALUES (?, ?, ?, ?, ?)', [product_id, variant_name, variant_value, stock, price]
        );
        return { variant_id: result.insertId, product_id, variant_name, variant_value, stock, price };
    },

    async update(id, { variant_name, variant_value, stock, price }) {
        await pool.query(
            'UPDATE product_variants SET variant_name = ?, variant_value = ?, stock = ?, price = ? WHERE variant_id = ?', [variant_name, variant_value, stock, price, id]
        );
        return { variant_id: id, variant_name, variant_value, stock, price };
    },

    async updateStock(id, newStock) {
        await pool.query('UPDATE product_variants SET stock = ? WHERE variant_id = ?', [newStock, id]);
        return true;
    },

    async delete(id) {
        await pool.query('DELETE FROM product_variants WHERE variant_id = ?', [id]);
        return true;
    },

    async findLowStock(threshold = 10) {
        const [rows] = await pool.query(
            'SELECT * FROM product_variants WHERE stock <= ? ORDER BY stock ASC', [threshold]
        );
        return rows;
    }
};

export default ProductVariant;