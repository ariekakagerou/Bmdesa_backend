// controller/BusinessUnitController.js
import db from '../config/db.js';

const BusinessUnitController = {
    // Mendapatkan semua unit usaha
    getAllBusinessUnits: async(req, res) => {
        try {
            // Query untuk mengambil data unit usaha
            const [rows] = await db.query('SELECT * FROM BusinessUnits');
            res.json(rows);
        } catch (error) {
            console.error('Error:', error.message); // Log error untuk debug
            res.status(500).json({ error: 'Gagal mengambil data unit usaha' });
        }
    },

    // Menambahkan unit usaha baru
    addBusinessUnit: async(req, res) => {
        const { name, description, manager_id } = req.body;

        // Validasi input
        if (!name || !manager_id) {
            return res.status(400).json({ error: 'Nama dan Manager ID wajib diisi' });
        }

        try {
            // Cek apakah manager_id ada di tabel Users
            const [manager] = await db.query('SELECT * FROM Users WHERE user_id = ?', [manager_id]);
            if (manager.length === 0) {
                return res.status(400).json({ error: 'Manager dengan ID tersebut tidak ditemukan' });
            }

            // Jika manager_id valid, lanjutkan untuk menambahkan unit usaha
            const [result] = await db.query(
                'INSERT INTO BusinessUnits (name, description, manager_id) VALUES (?, ?, ?)', [name, description, manager_id]
            );

            res.status(201).json({ message: 'Unit usaha berhasil dibuat', unitId: result.insertId });
        } catch (error) {
            console.error('Error:', error.message); // Log error untuk debug
            res.status(500).json({ error: 'Gagal membuat unit usaha' });
        }
    }
};

export default BusinessUnitController;