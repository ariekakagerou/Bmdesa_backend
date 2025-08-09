import express from 'express';
import ProductTagMapController from '../controller/ProductTagMapController.js';

const router = express.Router();

// GET /api/product-tag-maps - Mendapatkan semua mapping
router.get('/', ProductTagMapController.getAllMappings);

// POST /api/product-tag-maps - Membuat mapping baru
router.post('/', ProductTagMapController.createMapping);

// GET berdasarkan product_id
router.get('/product/:product_id', ProductTagMapController.getTagsByProductId);

// GET berdasarkan tag_id
router.get('/tag/:tag_id', ProductTagMapController.getProductsByTagId);

// DELETE mapping spesifik
router.delete('/:product_id/:tag_id', ProductTagMapController.deleteMapping);

// Bulk create
router.post('/bulk', ProductTagMapController.bulkCreateMappings);

// DELETE semua mapping untuk product
router.delete('/product/:product_id', ProductTagMapController.deleteAllMappingsForProduct);

// DELETE semua mapping untuk tag
router.delete('/tag/:tag_id', ProductTagMapController.deleteAllMappingsForTag);

// ✅ gunakan export default agar bisa di-import dengan `import ... from`
export default router;
