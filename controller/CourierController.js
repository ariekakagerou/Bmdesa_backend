import Courier from '../models/Courier.js';

const CourierController = {
  async getAllCouriers(req, res) {
    try {
      const couriers = await Courier.findAll();
      res.status(200).json(couriers);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mengambil data kurir' });
    }
  },

  async getCourierById(req, res) {
    try {
      const courier = await Courier.findByPk(req.params.id);
      if (!courier) return res.status(404).json({ error: 'Kurir tidak ditemukan' });
      res.status(200).json(courier);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mengambil kurir' });
    }
  },

  async createCourier(req, res) {
    try {
      const { name, phone } = req.body;
      const courier = await Courier.create({ name, phone });
      res.status(201).json(courier);
    } catch (error) {
      res.status(400).json({ error: 'Gagal membuat kurir' });
    }
  },

  async updateCourier(req, res) {
    try {
      const courier = await Courier.findByPk(req.params.id);
      if (!courier) return res.status(404).json({ error: 'Kurir tidak ditemukan' });

      const { name, phone } = req.body;
      await courier.update({ name, phone });
      res.status(200).json(courier);
    } catch (error) {
      res.status(400).json({ error: 'Gagal mengupdate kurir' });
    }
  },

  async deleteCourier(req, res) {
    try {
      const courier = await Courier.findByPk(req.params.id);
      if (!courier) return res.status(404).json({ error: 'Kurir tidak ditemukan' });

      await courier.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Gagal menghapus kurir' });
    }
  },
};

export default CourierController;
