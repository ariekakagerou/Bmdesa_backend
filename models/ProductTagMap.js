import pool from '../config/db.js';

const ProductTagMap = {
    // Mendapatkan semua mapping
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM product_tag_maps');
        return rows;
    },

    // Cari satu mapping berdasarkan product_id dan tag_id
    async findOne({ product_id, tag_id }) {
        const [rows] = await pool.query(
            'SELECT * FROM product_tag_maps WHERE product_id = ? AND tag_id = ? LIMIT 1', [product_id, tag_id]
        );
        return rows[0] || null;
    },

    // Membuat 1 mapping baru
    async create({ product_id, tag_id }) {
        await pool.query(
            'INSERT INTO product_tag_maps (product_id, tag_id) VALUES (?, ?)', [product_id, tag_id]
        );
        return { product_id, tag_id };
    },

    // Hapus berdasarkan product_id dan tag_id
    async destroy({ product_id, tag_id }) {
        const whereClauses = [];
        const params = [];

        if (product_id) {
            whereClauses.push('product_id = ?');
            params.push(product_id);
        }

        if (tag_id) {
            whereClauses.push('tag_id = ?');
            params.push(tag_id);
        }

        const whereSQL = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';
        const [result] = await pool.query(`DELETE FROM product_tag_maps ${whereSQL}`, params);
        return result.affectedRows;
    },

    // Bulk insert: satu produk, banyak tag
    async bulkCreate(product_id, tag_ids) {
        if (!Array.isArray(tag_ids) || tag_ids.length === 0) return [];

        const values = tag_ids.map(tag_id => [product_id, tag_id]);
        await pool.query('INSERT INTO product_tag_maps (product_id, tag_id) VALUES ?', [values]);

        return tag_ids.map(tag_id => ({ product_id, tag_id }));
    }
};

export default ProductTagMap;