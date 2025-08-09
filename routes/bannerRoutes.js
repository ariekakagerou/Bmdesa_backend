import express from 'express';
import { BannerController, upload } from '../controller/BannerController.js';

const router = express.Router();

// GET Routes
router.get('/', BannerController.getAllBanners);
router.get('/active', BannerController.getActiveBanners);
router.get('/:id', BannerController.getBannerById);

// POST Route
router.post('/', upload.single('image'), BannerController.createBanner);

// PUT Route
router.put('/:id', upload.single('image'), BannerController.updateBanner);

// DELETE Route
router.delete('/:id', BannerController.deleteBanner);

// PATCH Route
router.patch('/:id/toggle', BannerController.toggleBannerStatus);

// ✅ Export default agar bisa digunakan dengan import bannerRoutes from ...
export default router;