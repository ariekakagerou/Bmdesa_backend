import express from 'express';
import ProductReviewController from '../controller/ProductReviewController.js';


// Middleware untuk validasi
const validateReviewData = (req, res, next) => {
  const { product_id, user_id, rating, comment } = req.body;
  
  // Validasi tipe data
  if (product_id && !Number.isInteger(Number(product_id))) {
    return res.status(400).json({
      success: false,
      message: 'Product ID must be a valid integer'
    });
  }
  
  if (user_id && !Number.isInteger(Number(user_id))) {
    return res.status(400).json({
      success: false,
      message: 'User ID must be a valid integer'
    });
  }
  
  if (rating && (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5)) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer between 1 and 5'
    });
  }
  
  if (comment && typeof comment !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Comment must be a string'
    });
  }
  
  next();
};

// Middleware untuk validasi parameter ID
const validateIdParam = (req, res, next) => {
  const { id, productId, userId } = req.params;
  
  if (id && !Number.isInteger(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'Review ID must be a valid integer'
    });
  }
  
  if (productId && !Number.isInteger(Number(productId))) {
    return res.status(400).json({
      success: false,
      message: 'Product ID must be a valid integer'
    });
  }
  
  if (userId && !Number.isInteger(Number(userId))) {
    return res.status(400).json({
      success: false,
      message: 'User ID must be a valid integer'
    });
  }
  
  next();
};

function createProductReviewRoutes(db) {
  const router = express.Router();
  const controller = new ProductReviewController(db);
  
  // Routes untuk Product Reviews
  
  // GET /api/reviews - Mendapatkan semua review
  router.get('/', controller.getAllReviews);
  
  // GET /api/reviews/:id - Mendapatkan review berdasarkan ID
  router.get('/:id', validateIdParam, controller.getReviewById);
  
  // GET /api/reviews/product/:productId - Mendapatkan review berdasarkan product ID
  router.get('/product/:productId', validateIdParam, controller.getReviewsByProductId);
  
  // GET /api/reviews/user/:userId - Mendapatkan review berdasarkan user ID
  router.get('/user/:userId', validateIdParam, controller.getReviewsByUserId);
  
  // GET /api/reviews/product/:productId/average - Mendapatkan rata-rata rating produk
  router.get('/product/:productId/average', validateIdParam, controller.getProductAverageRating);
  
  // POST /api/reviews - Membuat review baru
  router.post('/', validateReviewData, controller.createReview);
  
  // PUT /api/reviews/:id - Update review
  router.put('/:id', validateIdParam, validateReviewData, controller.updateReview);
  
  // DELETE /api/reviews/:id - Menghapus review
  router.delete('/:id', validateIdParam, controller.deleteReview);
  
  return router;
}

export default createProductReviewRoutes;