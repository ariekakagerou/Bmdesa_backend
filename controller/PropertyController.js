import db from '../config/db.js';

const PropertyController = {
    // CREATE
    async createProperty(req, res) {
        const { unit_id, name, description, location, price, size, status, image_url } = req.body;

        if (!unit_id || !name || !location || !price || !size || !status) {
            return res.status(400).json({ message: 'Field wajib tidak boleh kosong.' });
        }

        try {
            const [result] = await db.execute(`
        INSERT INTO properties (unit_id, name, description, location, price, size, status, image_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [unit_id, name, description, location, price, size, status, image_url]);

            const [property] = await db.execute(`SELECT * FROM properties WHERE property_id = ?`, [result.insertId]);

            res.status(201).json({
                message: 'Properti berhasil ditambahkan.',
                data: property[0]
            });
        } catch (error) {
            console.error('CREATE error:', error.message);
            res.status(500).json({ message: 'Gagal menambahkan properti.', error: error.message });
        }
    },

    // READ ALL
    async getAllProperties(req, res) {
        try {
            const [properties] = await db.execute(`
        SELECT p.*, u.name AS unit_name
        FROM properties p
        LEFT JOIN units u ON p.unit_id = u.unit_id
        ORDER BY p.created_at DESC
      `);
            res.json(properties);
        } catch (error) {
            console.error('GET ALL error:', error.message);
            res.status(500).json({ message: 'Gagal mengambil data properti.', error: error.message });
        }
    },

    // UPDATE
    async updateProperty(req, res) {
        const { property_id } = req.params;
        const { unit_id, name, description, location, price, size, status, image_url } = req.body;

        try {
            const [result] = await db.execute(`
        UPDATE properties SET
        unit_id = ?, name = ?, description = ?, location = ?, price = ?, size = ?, status = ?, image_url = ?, updated_at = NOW()
        WHERE property_id = ?
      `, [unit_id, name, description, location, price, size, status, image_url, property_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Properti tidak ditemukan.' });
            }

            const [updated] = await db.execute(`SELECT * FROM properties WHERE property_id = ?`, [property_id]);

            res.json({
                message: 'Properti berhasil diperbarui.',
                data: updated[0]
            });
        } catch (error) {
            console.error('UPDATE error:', error.message);
            res.status(500).json({ message: 'Gagal memperbarui properti.', error: error.message });
        }
    },

    // DELETE
    async deleteProperty(req, res) {
        const { property_id } = req.params;

        try {
            const [result] = await db.execute(`DELETE FROM properties WHERE property_id = ?`, [property_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Properti tidak ditemukan.' });
            }

            res.json({ message: 'Properti berhasil dihapus.' });
        } catch (error) {
            console.error('DELETE error:', error.message);
            res.status(500).json({ message: 'Gagal menghapus properti.', error: error.message });
        }
    }
};

export default PropertyController;