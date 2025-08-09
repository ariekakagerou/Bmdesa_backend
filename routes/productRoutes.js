// routes/productRoutes.js
import express from 'express';
const router = express.Router();
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    searchProducts,
    getTrendingProducts
} from '../controller/Productcontroller.js';
import authenticateJWT from '../middleware/auth.js';

// Route untuk mendapatkan semua produk (untuk dashboard user)
router.get('/all', getAllProducts);

// Route untuk mendapatkan produk trending
router.get('/trending', getTrendingProducts);

// Route untuk mencari produk
router.get('/search', searchProducts);

// Route untuk mendapatkan semua produk (dengan auth)
router.get('/', authenticateJWT, getAllProducts);

// Route untuk mendapatkan produk berdasarkan ID
router.get('/:id', getProductById);

// Route untuk membuat produk baru (merchant only)
router.post('/product', authenticateJWT, createProduct);

// Route untuk update produk (merchant only)
router.put('/:id', authenticateJWT, updateProduct);

// Route untuk menghapus produk (merchant only)
router.delete('/:id', authenticateJWT, deleteProduct);

export default router;