import Invoice from '../models/Invoice.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/invoices/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'invoice-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar dan dokumen yang diizinkan!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

class InvoiceController {
  static async getAllInvoices(req, res) {
    try {
      const { page = 1, limit = 10, transaction_id } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (transaction_id) {
        whereClause.transaction_id = transaction_id;
      }

      const invoices = await Invoice.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        message: 'Data invoice berhasil diambil',
        data: {
          invoices: invoices.rows,
          pagination: {
            total: invoices.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(invoices.count / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data invoice', error: error.message });
    }
  }

  static async getInvoiceById(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
      }
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data invoice', error: error.message });
    }
  }

  static async createInvoice(req, res) {
    try {
      const { transaction_id } = req.body;
      if (!transaction_id) {
        return res.status(400).json({ success: false, message: 'transaction_id wajib diisi' });
      }

      const invoiceData = {
        transaction_id: parseInt(transaction_id),
        created_at: new Date()
      };

      if (req.file) {
        invoiceData.file_url = req.file.path;
      }

      const invoice = await Invoice.create(invoiceData);
      res.status(201).json({ success: true, message: 'Invoice berhasil dibuat', data: invoice });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, message: 'Gagal membuat invoice', error: error.message });
    }
  }

  static async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
      }

      const updateData = {};
      if (req.body.transaction_id) {
        updateData.transaction_id = parseInt(req.body.transaction_id);
      }

      if (req.file) {
        if (invoice.file_url && fs.existsSync(invoice.file_url)) {
          fs.unlinkSync(invoice.file_url);
        }
        updateData.file_url = req.file.path;
      }

      await invoice.update(updateData);
      res.status(200).json({ success: true, message: 'Invoice berhasil diupdate', data: invoice });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, message: 'Gagal mengupdate invoice', error: error.message });
    }
  }

  static async deleteInvoice(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
      }

      if (invoice.file_url && fs.existsSync(invoice.file_url)) {
        fs.unlinkSync(invoice.file_url);
      }

      await invoice.destroy();
      res.status(200).json({ success: true, message: 'Invoice berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal menghapus invoice', error: error.message });
    }
  }

  static async getInvoiceByTransactionId(req, res) {
    try {
      const invoices = await Invoice.findAll({
        where: { transaction_id: parseInt(req.params.transaction_id) },
        order: [['created_at', 'DESC']]
      });
      res.status(200).json({ success: true, message: 'Data invoice berhasil diambil', data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data invoice', error: error.message });
    }
  }
}

export { InvoiceController, upload };
