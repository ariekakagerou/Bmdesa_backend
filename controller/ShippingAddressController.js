import ShippingAddress from '../models/shipping_address.js';

const ShippingAddressController = {
    async index(_req, res) {
        try {
            const [addresses] = await ShippingAddress.getAll();
            res.json(addresses);
        } catch (err) {
            res.status(500).json({ error: 'Gagal mengambil data' });
        }
    },

    async show(req, res) {
        try {
            const [rows] = await ShippingAddress.getById(req.params.id);
            if (rows.length === 0) return res.status(404).json({ error: 'Alamat tidak ditemukan' });
            res.json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Gagal mengambil detail' });
        }
    },

    async store(req, res) {
        try {
            const requiredFields = ['user_id', 'recipient_name', 'phone', 'address', 'city', 'district', 'subdistrict', 'province', 'post_code'];
            const missing = requiredFields.filter(f => !req.body[f]);
            if (missing.length > 0) {
                return res.status(400).json({ error: 'Field berikut wajib diisi: ' + missing.join(', ') });
            }

            await ShippingAddress.create(req.body);
            res.status(201).json({ message: 'Alamat berhasil ditambahkan' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal menambahkan alamat' });
        }
    },

    async update(req, res) {
        try {
            const [rows] = await ShippingAddress.getById(req.params.id);
            if (rows.length === 0) return res.status(404).json({ error: 'Alamat tidak ditemukan' });

            await ShippingAddress.update(req.params.id, req.body);
            res.json({ message: 'Alamat berhasil diperbarui' });
        } catch (err) {
            res.status(500).json({ error: 'Gagal memperbarui alamat' });
        }
    },

    async destroy(req, res) {
        try {
            const [rows] = await ShippingAddress.getById(req.params.id);
            if (rows.length === 0) return res.status(404).json({ error: 'Alamat tidak ditemukan' });

            await ShippingAddress.delete(req.params.id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: 'Gagal menghapus alamat' });
        }
    }
};

export default ShippingAddressController;