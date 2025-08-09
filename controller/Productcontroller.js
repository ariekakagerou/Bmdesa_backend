// controller/ProductController.js
import db from '../config/db.js';

// Mendapatkan semua produk (untuk dashboard user dan trending)
export const getAllProducts = async(req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        `);
        
        // Transform data untuk Flutter
        const transformedProducts = products.map(product => ({
            id: product.product_id.toString(),
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stock: product.stock,
            category: product.category_name || 'Lainnya',
            imageUrl: product.image_url || '',
            isActive: product.status === 'active',
            createdAt: product.created_at,
            updatedAt: product.updated_at
        }));
        
        res.json(transformedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data produk' });
    }
};

// Mendapatkan produk berdasarkan ID
export const getProductById = async(req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?
        `, [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        const product = products[0];
        const transformedProduct = {
            id: product.product_id.toString(),
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stock: product.stock,
            category: product.category_name || 'Lainnya',
            imageUrl: product.image_url || '',
            isActive: product.status === 'active',
            createdAt: product.created_at,
            updatedAt: product.updated_at
        };

        res.json(transformedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk' });
    }
};

// Mendapatkan produk berdasarkan merchant (Dihapus karena tidak ada merchantId)
// export const getProductsByMerchant = ... (hapus seluruh fungsi ini)

// Membuat produk baru (tanpa merchantId/unitName)
export const createProduct = async(req, res) => {
    const { 
        name, 
        price, 
        stock, 
        description, 
        category, 
        imageUrl
    } = req.body;

    if (!name || !price || !stock) {
        return res.status(400).json({ message: 'Field wajib tidak boleh kosong' });
    }

    try {
        // Cek atau buat kategori
        let categoryId = null;
        if (category) {
            const [categoryCheck] = await db.execute(
                'SELECT category_id FROM categories WHERE name = ?', 
                [category]
            );
            
            if (categoryCheck.length === 0) {
                const [newCategory] = await db.execute(
                    'INSERT INTO categories (name) VALUES (?)',
                    [category]
                );
                categoryId = newCategory.insertId;
            } else {
                categoryId = categoryCheck[0].category_id;
            }
        }

        // Cek duplikat nama produk
        const [existing] = await db.execute(
            `SELECT * FROM products WHERE name = ?`, 
            [name]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Nama produk sudah digunakan' });
        }

        // Insert produk baru
        const [result] = await db.execute(`
            INSERT INTO products (name, price, stock, description, category_id, status, image_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'active', ?, NOW(), NOW())
        `, [name, price, stock, description, categoryId, imageUrl || null]);

        // Ambil data produk yang baru dibuat
        const [newProduct] = await db.execute(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?
        `, [result.insertId]);

        const product = newProduct[0];
        const transformedProduct = {
            id: product.product_id.toString(),
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stock: product.stock,
            category: product.category_name || 'Lainnya',
            imageUrl: product.image_url || '',
            isActive: product.status === 'active',
            createdAt: product.created_at,
            updatedAt: product.updated_at
        };

        res.status(201).json({ 
            message: 'Produk berhasil dibuat', 
            product: transformedProduct 
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Gagal membuat produk' });
    }
};

// Memperbarui produk
export const updateProduct = async(req, res) => {
    const { 
        name, 
        price, 
        stock, 
        description, 
        category, 
        imageUrl, 
        isActive 
    } = req.body;

    if (!name || !price || !stock) {
        return res.status(400).json({ message: 'Field wajib tidak boleh kosong' });
    }

    try {
        // Cek apakah produk ada
        const [existing] = await db.execute('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        // Update kategori jika ada
        let categoryId = null;
        if (category) {
            const [categoryCheck] = await db.execute(
                'SELECT category_id FROM categories WHERE name = ?', 
                [category]
            );
            
            if (categoryCheck.length === 0) {
                const [newCategory] = await db.execute(
                    'INSERT INTO categories (name) VALUES (?)',
                    [category]
                );
                categoryId = newCategory.insertId;
            } else {
                categoryId = categoryCheck[0].category_id;
            }
        }

        const status = isActive ? 'active' : 'inactive';

        await db.execute(`
            UPDATE products SET
                name = ?, price = ?, stock = ?, description = ?,
                category_id = ?, status = ?, image_url = ?, updated_at = NOW()
            WHERE product_id = ?
        `, [name, price, stock, description, categoryId, status, imageUrl, req.params.id]);

        res.json({ message: 'Produk berhasil diperbarui' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Gagal memperbarui produk' });
    }
};

// Menghapus produk
export const deleteProduct = async(req, res) => {
    try {
        const [result] = await db.execute(`DELETE FROM products WHERE product_id = ?`, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        res.json({ message: 'Produk berhasil dihapus' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus produk' });
    }
};

// Mencari produk
export const searchProducts = async(req, res) => {
    const { keyword, category, minPrice, maxPrice } = req.query;

    try {
        let query = `
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.status = 'active'
        `;
        
        const params = [];

        if (keyword) {
            query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        if (category) {
            query += ` AND c.name = ?`;
            params.push(category);
        }

        if (minPrice) {
            query += ` AND p.price >= ?`;
            params.push(minPrice);
        }

        if (maxPrice) {
            query += ` AND p.price <= ?`;
            params.push(maxPrice);
        }

        query += ` ORDER BY p.created_at DESC`;

        const [products] = await db.execute(query, params);

        const transformedProducts = products.map(product => ({
            id: product.product_id.toString(),
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stock: product.stock,
            category: product.category_name || 'Lainnya',
            imageUrl: product.image_url || '',
            isActive: product.status === 'active',
            createdAt: product.created_at,
            updatedAt: product.updated_at
        }));

        res.json(transformedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari produk' });
    }
};

// Mendapatkan produk trending (berdasarkan penjualan atau rating)
export const getTrendingProducts = async(req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
            LIMIT 20
        `);

        const transformedProducts = products.map(product => ({
            id: product.product_id.toString(),
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stock: product.stock,
            category: product.category_name || 'Lainnya',
            imageUrl: product.image_url || '',
            isActive: product.status === 'active',
            createdAt: product.created_at,
            updatedAt: product.updated_at
        }));

        res.json(transformedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk trending' });
    }
};