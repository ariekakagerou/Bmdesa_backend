import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/banners/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

class BannerController {
  static async getAllBanners(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM banners ORDER BY banner_id DESC');
      res.status(200).json({ success: true, message: 'Banners retrieved successfully', data: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving banners', error: error.message });
    }
  }

  static async getActiveBanners(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY banner_id DESC');
      res.status(200).json({ success: true, message: 'Active banners retrieved successfully', data: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving active banners', error: error.message });
    }
  }

  static async getBannerById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.execute('SELECT * FROM banners WHERE banner_id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Banner not found' });
      res.status(200).json({ success: true, message: 'Banner retrieved successfully', data: rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving banner', error: error.message });
    }
  }

  static async createBanner(req, res) {
    try {
      const { title, link_url, message, is_active } = req.body;
      if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Title is required' });
      }

      const image_url = req.file ? `uploads/banners/${req.file.filename}` : null;

      const values = [
        title.trim(),
        image_url,
        link_url || null,
        message || null,
        is_active !== undefined ? parseInt(is_active) : 1
      ];

      const [result] = await db.execute(
        `INSERT INTO banners (title, image_url, link_url, message, is_active) VALUES (?, ?, ?, ?, ?)`,
        values
      );

      const [newBanner] = await db.execute('SELECT * FROM banners WHERE banner_id = ?', [result.insertId]);
      res.status(201).json({ success: true, message: 'Banner created successfully', data: newBanner[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating banner', error: error.message });
    }
  }

  static async updateBanner(req, res) {
    try {
      const { id } = req.params;
      const { title, link_url, message, is_active } = req.body;

      const [existingBanner] = await db.execute('SELECT * FROM banners WHERE banner_id = ?', [id]);
      if (existingBanner.length === 0) return res.status(404).json({ success: false, message: 'Banner not found' });

      let image_url = existingBanner[0].image_url;

      if (req.file) {
        if (existingBanner[0].image_url) {
          const oldImagePath = path.join(__dirname, '..', existingBanner[0].image_url);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        image_url = `uploads/banners/${req.file.filename}`;
      }

      const values = [
        title || existingBanner[0].title,
        image_url,
        link_url !== undefined ? link_url : existingBanner[0].link_url,
        message !== undefined ? message : existingBanner[0].message,
        is_active !== undefined ? parseInt(is_active) : existingBanner[0].is_active,
        id
      ];

      await db.execute(
        `UPDATE banners SET title = ?, image_url = ?, link_url = ?, message = ?, is_active = ? WHERE banner_id = ?`,
        values
      );

      const [updatedBanner] = await db.execute('SELECT * FROM banners WHERE banner_id = ?', [id]);
      res.status(200).json({ success: true, message: 'Banner updated successfully', data: updatedBanner[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating banner', error: error.message });
    }
  }

  static async deleteBanner(req, res) {
    try {
      const { id } = req.params;

      const [existingBanner] = await db.execute('SELECT * FROM banners WHERE banner_id = ?', [id]);
      if (existingBanner.length === 0) return res.status(404).json({ success: false, message: 'Banner not found' });

      if (existingBanner[0].image_url) {
        const imagePath = path.join(__dirname, '..', existingBanner[0].image_url);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await db.execute('DELETE FROM banners WHERE banner_id = ?', [id]);
      res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting banner', error: error.message });
    }
  }

  static async toggleBannerStatus(req, res) {
    try {
      const { id } = req.params;

      const [existingBanner] = await db.execute('SELECT is_active FROM banners WHERE banner_id = ?', [id]);
      if (existingBanner.length === 0) return res.status(404).json({ success: false, message: 'Banner not found' });

      const newStatus = existingBanner[0].is_active === 1 ? 0 : 1;
      await db.execute('UPDATE banners SET is_active = ? WHERE banner_id = ?', [newStatus, id]);

      res.status(200).json({
        success: true,
        message: `Banner ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
        data: { is_active: newStatus }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error toggling banner status', error: error.message });
    }
  }
}

export { BannerController, upload };
