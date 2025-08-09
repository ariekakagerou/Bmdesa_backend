import Voucher from '../models/Voucher.js';

const VoucherController = {
  // Get all vouchers
  getAllVouchers: async (req, res) => {
    try {
      const vouchers = await Voucher.findAll();
      res.json(vouchers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get voucher by ID
  getVoucherById: async (req, res) => {
    try {
      const voucher = await Voucher.findByPk(req.params.id);
      if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
      res.json(voucher);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create voucher
  createVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.create(req.body);
      res.status(201).json(voucher);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update voucher
  updateVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.findByPk(req.params.id);
      if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
      await voucher.update(req.body);
      res.json(voucher);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete voucher
  deleteVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.findByPk(req.params.id);
      if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
      await voucher.destroy();
      res.json({ message: 'Voucher deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default VoucherController;
