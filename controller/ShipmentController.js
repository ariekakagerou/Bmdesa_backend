// controller/ShipmentController.js
import Shipment from '../models/shipment.js';
import axios from 'axios';

class ShipmentController {
    async index(req, res) {
        try {
            const shipments = await Shipment.getAll();
            res.json(shipments);
        } catch (err) {
            console.error('❌ Error getting shipments:', err);
            res.status(500).json({ error: 'Gagal mengambil data shipment' });
        }
    }

    async store(req, res) {
        try {
            const shipment = await Shipment.create(req.body);
            res.status(201).json(shipment);
        } catch (err) {
            console.error('❌ Error creating shipment:', err);
            res.status(500).json({ error: 'Gagal membuat shipment' });
        }
    }

    async show(req, res) {
        try {
            const shipment = await Shipment.getById(req.params.shipment_id);
            if (!shipment) {
                return res.status(404).json({ error: 'Shipment tidak ditemukan' });
            }
            res.json(shipment);
        } catch (err) {
            console.error('❌ Error getting shipment detail:', err);
            res.status(500).json({ error: 'Gagal mengambil detail shipment' });
        }
    }

    async update(req, res) {
        try {
            const found = await Shipment.getById(req.params.shipment_id);
            if (!found) {
                return res.status(404).json({ error: 'Shipment tidak ditemukan' });
            }

            const updated = await Shipment.update(req.params.shipment_id, req.body);
            res.json(updated);
        } catch (err) {
            console.error('❌ Error updating shipment:', err);
            res.status(500).json({ error: 'Gagal memperbarui shipment' });
        }
    }

    async destroy(req, res) {
        try {
            const found = await Shipment.getById(req.params.shipment_id);
            if (!found) {
                return res.status(404).json({ error: 'Shipment tidak ditemukan' });
            }

            await Shipment.delete(req.params.shipment_id);
            res.status(200).json({ message: 'Shipment berhasil dihapus' });
        } catch (err) {
            console.error('❌ Error deleting shipment:', err);
            res.status(500).json({ error: 'Gagal menghapus shipment' });
        }
    }

    async checkOngkir(req, res) {
        console.log('Request Body:', req.body);
        try {
            const {
                origin_subdistrict,
                destination_subdistrict,
                weight,
                courier
            } = req.body;

            // Validasi input
            if (!origin_subdistrict || !destination_subdistrict || !weight || !courier) {
                return res.status(400).json({
                    error: 'Harap isi: origin_subdistrict, destination_subdistrict, weight, dan courier'
                });
            }

            // Kirim permintaan ke API RajaOngkir
            const response = await axios.post(
                'https://api.rajaongkir.com/starter/cost', {
                    origin: origin_subdistrict,
                    destination: destination_subdistrict,
                    weight,
                    courier
                }, {
                    headers: {
                        key: process.env.RAJAONGKIR_API_KEY_PENGIRIMAN,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            // Cek apakah response dari API RajaOngkir berhasil
            if (response.data && response.data.rajaongkir && response.data.rajaongkir.status.code !== 200) {
                return res.status(400).json({
                    error: 'Kesalahan dari API RajaOngkir',
                    detail: response.data.rajaongkir.status.description
                });
            }

            res.json(response.data);
        } catch (error) {
            const errorData = error.response ? error.response.data || error.message : error.message;
            console.error('❌ RajaOngkir API Error:', errorData);
            res.status(500).json({
                error: 'Gagal memeriksa ongkir',
                detail: errorData
            });
        }
    }

}

// 👉 Ini bagian penting: instansiasi agar bisa dipakai langsung di router
const shipmentController = new ShipmentController();
export default shipmentController;