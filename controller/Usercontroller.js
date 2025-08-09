import User from '../models/User.js';
import db from '../config/db.js'; // Added for verifyMerchant

// Mendapatkan semua pengguna (khusus admin)
export const getAllUsers = async(req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users.map(user => ({
            id: user.id,
            users_id: user.users_id,
            name: user.name,
            username: user.username,
            jenis_kelamin: user.jenis_kelamin,
            tanggal_lahir: user.tanggal_lahir,
            email: user.email,
            phone: user.phone,
            foto_profil: user.foto_profil,
            foto_ktp: user.foto_ktp,
            bio_users: user.bio_users,
            address: user.address,
            role: user.role,
            status: user.status,
            email_verified_at: user.email_verified_at,
            remember_token: user.remember_token,
            nomor_rekening: user.nomor_rekening,
            kontak_darurat: user.kontak_darurat,
            siup_nib: user.siup_nib,
            nama_usaha: user.nama_usaha,
            jenis_produk_layanan: user.jenis_produk_layanan,
            alamat_usaha: user.alamat_usaha,
            created_at: user.created_at,
            updated_at: user.updated_at
        })));
    } catch (err) {
        console.error('Error while getting users:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mendapatkan pengguna berdasarkan ID
export const getUserById = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdRaw(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userData = {
            id: user.id,
            users_id: user.users_id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            foto_profil: user.foto_profil,
            foto_ktp: user.foto_ktp,
            bio_users: user.bio_users,
            jenis_kelamin: user.jenis_kelamin,
            tanggal_lahir: user.tanggal_lahir,
            address: user.address,
            role: user.role,
            status: user.status,
            nomor_rekening: user.nomor_rekening,
            kontak_darurat: user.kontak_darurat,
            siup_nib: user.siup_nib,
            nama_usaha: user.nama_usaha,
            jenis_produk_layanan: user.jenis_produk_layanan,
            alamat_usaha: user.alamat_usaha,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
        res.status(200).json(userData);
    } catch (err) {
        console.error('Error while getting user by ID:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mendapatkan pengguna berdasarkan identifier (email/phone/username)
export const getUserByIdentifier = async(req, res) => {
    const { identifier } = req.query;
    if (!identifier) {
        return res.status(400).json({ message: 'Identifier (email/phone/username) wajib diisi' });
    }
    try {
        const user = await User.findByIdentifier(identifier);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // return user data
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Memperbarui data pengguna (hanya untuk dirinya sendiri)
export const updateUser = async(req, res) => {
    const { id } = req.params;
    const {
        name,
        phone,
        address,
        foto_profil,
        tanggal_lahir,
        jenis_kelamin,
        bio_users,
        nomor_rekening,
        kontak_darurat,
        siup_nib,
        nama_usaha,
        jenis_produk_layanan,
        alamat_usaha
    } = req.body;

    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own account.' });
    }

    try {
        const updateData = {
            name: name || req.user.name,
            phone: phone || req.user.phone,
            address: address || req.user.address,
            foto_profil: foto_profil || req.user.foto_profil,
            tanggal_lahir: tanggal_lahir || req.user.tanggal_lahir,
            jenis_kelamin: jenis_kelamin || req.user.jenis_kelamin,
            bio_users: bio_users || req.user.bio_users,
            nomor_rekening: nomor_rekening || req.user.nomor_rekening,
            kontak_darurat: kontak_darurat || req.user.kontak_darurat,
            siup_nib: siup_nib || req.user.siup_nib,
            nama_usaha: nama_usaha || req.user.nama_usaha,
            jenis_produk_layanan: jenis_produk_layanan || req.user.jenis_produk_layanan,
            alamat_usaha: alamat_usaha || req.user.alamat_usaha
        };

        await User.update(id, updateData);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error while updating user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Menghapus pengguna (admin only)
export const deleteUser = async(req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin role required to delete users.' });
    }

    try {
        await User.delete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error while deleting user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PATCH /api/users/:id/verify-merchant
export const verifyMerchant = async (req, res) => {
  const { status, catatanAdmin } = req.body; // status: 'approved' atau 'rejected'
  const userId = req.params.id;

  try {
    if (status === 'approved') {
      // Ubah role user menjadi merchant
      await db.execute(
        'UPDATE users SET role = ?, status = ? WHERE user_id = ?',
        ['merchant', 'active', userId]
      );
      res.json({ success: true, message: 'User berhasil diverifikasi sebagai merchant' });
    } else if (status === 'rejected') {
      // Simpan catatan penolakan (bisa di kolom khusus atau log)
      await db.execute(
        'UPDATE users SET status = ?, catatan_admin = ? WHERE user_id = ?',
        ['inactive', catatanAdmin || '', userId]
      );
      res.json({ success: true, message: 'Verifikasi merchant ditolak', catatan: catatanAdmin });
    } else {
      res.status(400).json({ success: false, message: 'Status tidak valid' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memproses verifikasi' });
  }
};