// routes/shippingRateRoutes.js

import express from 'express';
import ShippingRateController from '../controller/ShippingRateController.js';

const router = express.Router();

// GET semua shipping rates (bisa juga dengan query: search, origin_city, destination_city, service_id)
router.get('/', ShippingRateController.getAllShippingRates);

// GET shipping rate by ID
router.get('/:id', ShippingRateController.getShippingRateById);

// POST buat shipping rate baru
router.post('/', ShippingRateController.createShippingRate);

// PUT update shipping rate
router.put('/:id', ShippingRateController.updateShippingRate);

// DELETE shipping rate
router.delete('/:id', ShippingRateController.deleteShippingRate);

// GET rute yang tersedia (origin & destination unik)
router.get('/available/routes', ShippingRateController.getAvailableRoutes);

// GET hitung ongkos kirim berdasarkan asal, tujuan, dan berat
router.get('/calculate/cost', ShippingRateController.calculateShippingCost);

export default router;
