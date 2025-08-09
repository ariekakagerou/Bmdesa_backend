import db from '../config/db.js';

class Product {
    static async create({ unit_id, category_id, name, description, price, stock, status, image_url }) {
        const [result] = await db.execute(
            `INSERT INTO products 
            (unit_id, category_id, name, description, price, stock, status, image_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, [unit_id, category_id, name, description, price, stock, status, image_url]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute(
            `SELECT p.*, u.name AS unit_name, c.name AS category_name
             FROM products p
             JOIN businessunits u ON p.unit_id = u.unit_id
             JOIN categories c ON p.category_id = c.category_id
             ORDER BY p.name`
        );
        return rows;
    }

    static async getByUnit(unitId) {
        const [rows] = await db.execute(
            `SELECT * FROM products WHERE unit_id = ? ORDER BY name`, [unitId]
        );
        return rows;
    }

    static async getById(productId) {
        const [rows] = await db.execute(
            `SELECT p.*, b.name AS unit_name, c.name AS category_name
             FROM products p
             JOIN businessunits b ON p.unit_id = b.unit_id
             JOIN categories c ON p.category_id = c.category_id
             WHERE p.product_id = ?`, [productId]
        );
        return rows[0];
    }

    static async update(productId, { name, description, price, stock, image_url, category_id, status, unit_id }) {
        await db.execute(
            `UPDATE products SET 
                name = ?, description = ?, price = ?, stock = ?, image_url = ?, 
                category_id = ?, status = ?, unit_id = ?, updated_at = NOW()
             WHERE product_id = ?`, [name, description, price, stock, image_url, category_id, status, unit_id, productId]
        );
    }

    static async updateStock(productId, quantity) {
        await db.execute(
            'UPDATE products SET stock = stock + ?, updated_at = NOW() WHERE product_id = ?', [quantity, productId]
        );
    }

    static async delete(productId) {
        await db.execute('DELETE FROM products WHERE product_id = ?', [productId]);
    }

    static async search(keyword) {
        const [rows] = await db.execute(
            `SELECT p.*, b.name AS unit_name, c.name AS category_name
             FROM products p
             JOIN businessunits b ON p.unit_id = b.unit_id
             JOIN categories c ON p.category_id = c.category_id
             WHERE p.name LIKE ? OR p.description LIKE ?`, [`%${keyword}%`, `%${keyword}%`]
        );
        return rows;
    }
}

export default Product;