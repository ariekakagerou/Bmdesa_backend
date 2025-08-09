import AdminModel from '../models/Admin.js'; // ✅ ganti dengan file model yang benar

import jwt from 'jsonwebtoken';

class AdminController {
  constructor() {
    this.adminModel = new AdminModel(); // ✅ Benar
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  getAllAdmins = async (req, res) => {
    try {
      const admins = await this.adminModel.getAllAdmins();
      res.status(200).json({ success: true, message: 'Data admin berhasil diambil', data: admins });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data admin', error: error.message });
    }
  };

  getAdminById = async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await this.adminModel.getAdminById(id);

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
      }

      res.status(200).json({ success: true, message: 'Data admin berhasil diambil', data: admin });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data admin', error: error.message });
    }
  };

  createAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
      }

      const existingAdmin = await this.adminModel.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(409).json({ success: false, message: 'Username sudah digunakan' });
      }

      const newAdmin = await this.adminModel.createAdmin(username, password);
      res.status(201).json({ success: true, message: 'Admin berhasil dibuat', data: newAdmin });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal membuat admin', error: error.message });
    }
  };

  updateAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password } = req.body;

      if (!username) {
        return res.status(400).json({ success: false, message: 'Username harus diisi' });
      }

      const existingAdmin = await this.adminModel.getAdminById(id);
      if (!existingAdmin) {
        return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
      }

      const adminWithSameUsername = await this.adminModel.getAdminByUsername(username);
      if (adminWithSameUsername && adminWithSameUsername.id != id) {
        return res.status(409).json({ success: false, message: 'Username sudah digunakan' });
      }

      const updated = await this.adminModel.updateAdmin(id, username, password);

      if (updated) {
        res.status(200).json({ success: true, message: 'Admin berhasil diupdate' });
      } else {
        res.status(400).json({ success: false, message: 'Gagal mengupdate admin' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengupdate admin', error: error.message });
    }
  };

  deleteAdmin = async (req, res) => {
    try {
      const { id } = req.params;

      const existingAdmin = await this.adminModel.getAdminById(id);
      if (!existingAdmin) {
        return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
      }

      const deleted = await this.adminModel.deleteAdmin(id);

      if (deleted) {
        res.status(200).json({ success: true, message: 'Admin berhasil dihapus' });
      } else {
        res.status(400).json({ success: false, message: 'Gagal menghapus admin' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal menghapus admin', error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
      }

      const loginResult = await this.adminModel.login(username, password);

      if (!loginResult.success) {
        return res.status(401).json({ success: false, message: loginResult.message });
      }

      const token = jwt.sign(
        {
          id: loginResult.data.id,
          username: loginResult.data.username,
          role: 'admin'
        },
        this.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: {
          admin: loginResult.data,
          token: token
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal melakukan login', error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.status(200).json({ success: true, message: 'Logout berhasil' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal melakukan logout', error: error.message });
    }
  };
}

export default AdminController;