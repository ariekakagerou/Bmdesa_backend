import ProductReview from '../models/ProductReview.js';


class ProductReviewController {
    constructor(db) {
        this.productReview = new ProductReview(db);
    }

    // GET /api/reviews - Mendapatkan semua review
    getAllReviews = async(req, res) => {
        try {
            const reviews = await this.productReview.getAllReviews();

            res.status(200).json({
                success: true,
                message: 'Reviews retrieved successfully',
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET /api/reviews/:id - Mendapatkan review berdasarkan ID
    getReviewById = async(req, res) => {
        try {
            const { id } = req.params;
            const review = await this.productReview.getReviewById(id);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Review retrieved successfully',
                data: review
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET /api/reviews/product/:productId - Mendapatkan review berdasarkan product ID
    getReviewsByProductId = async(req, res) => {
        try {
            const { productId } = req.params;
            const reviews = await this.productReview.getReviewsByProductId(productId);

            res.status(200).json({
                success: true,
                message: 'Product reviews retrieved successfully',
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET /api/reviews/user/:userId - Mendapatkan review berdasarkan user ID
    getReviewsByUserId = async(req, res) => {
        try {
            const { userId } = req.params;
            const reviews = await this.productReview.getReviewsByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'User reviews retrieved successfully',
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // POST /api/reviews - Membuat review baru
    createReview = async(req, res) => {
        try {
            const { product_id, user_id, rating, comment } = req.body;

            // Validasi input
            if (!product_id || !user_id || !rating) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID, User ID, and Rating are required'
                });
            }

            // Validasi rating (1-5)
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            // Cek apakah user sudah memberikan review untuk produk ini
            const hasReviewed = await this.productReview.hasUserReviewedProduct(user_id, product_id);
            if (hasReviewed) {
                return res.status(400).json({
                    success: false,
                    message: 'User has already reviewed this product'
                });
            }

            const newReview = await this.productReview.createReview(product_id, user_id, rating, comment);

            res.status(201).json({
                success: true,
                message: 'Review created successfully',
                data: newReview
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // PUT /api/reviews/:id - Update review
    updateReview = async(req, res) => {
        try {
            const { id } = req.params;
            const { rating, comment } = req.body;

            // Validasi input
            if (!rating) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating is required'
                });
            }

            // Validasi rating (1-5)
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            const updatedReview = await this.productReview.updateReview(id, rating, comment);

            if (!updatedReview) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Review updated successfully',
                data: updatedReview
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // DELETE /api/reviews/:id - Menghapus review
    deleteReview = async(req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.productReview.deleteReview(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET /api/reviews/product/:productId/average - Mendapatkan rata-rata rating produk
    getProductAverageRating = async(req, res) => {
        try {
            const { productId } = req.params;
            const stats = await this.productReview.getAverageRatingByProduct(productId);

            res.status(200).json({
                success: true,
                message: 'Product rating statistics retrieved successfully',
                data: {
                    product_id: productId,
                    average_rating: parseFloat(stats.average_rating.toFixed(2)),
                    total_reviews: stats.total_reviews
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}


export default ProductReviewController;
