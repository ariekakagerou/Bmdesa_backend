// ProductReview.js
class ProductReview {
    constructor(db) {
        this.db = db;
    }

    async getAllReviews() {
        const [rows] = await this.db.execute(`
      SELECT review_id, product_id, user_id, rating, comment, created_at 
      FROM product_reviews 
      ORDER BY created_at DESC
    `);
        return rows;
    }

    async getReviewById(reviewId) {
        const [rows] = await this.db.execute(
            'SELECT review_id, product_id, user_id, rating, comment, created_at FROM product_reviews WHERE review_id = ?', [reviewId]
        );
        return rows[0] || null;
    }

    async getReviewsByProductId(productId) {
        const [rows] = await this.db.execute(
            'SELECT review_id, product_id, user_id, rating, comment, created_at FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC', [productId]
        );
        return rows;
    }

    async getReviewsByUserId(userId) {
        const [rows] = await this.db.execute(
            'SELECT review_id, product_id, user_id, rating, comment, created_at FROM product_reviews WHERE user_id = ? ORDER BY created_at DESC', [userId]
        );
        return rows;
    }

    async createReview(productId, userId, rating, comment) {
        const [result] = await this.db.execute(
            'INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())', [productId, userId, rating, comment]
        );
        return await this.getReviewById(result.insertId);
    }

    async updateReview(reviewId, rating, comment) {
        const [result] = await this.db.execute(
            'UPDATE product_reviews SET rating = ?, comment = ? WHERE review_id = ?', [rating, comment, reviewId]
        );
        if (result.affectedRows === 0) return null;
        return await this.getReviewById(reviewId);
    }

    async deleteReview(reviewId) {
        const [result] = await this.db.execute(
            'DELETE FROM product_reviews WHERE review_id = ?', [reviewId]
        );
        return result.affectedRows > 0;
    }

    async getAverageRatingByProduct(productId) {
        const [rows] = await this.db.execute(
            'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM product_reviews WHERE product_id = ?', [productId]
        );
        return {
            average_rating: parseFloat(rows[0].average_rating) || 0,
            total_reviews: rows[0].total_reviews
        };
    }

    async hasUserReviewedProduct(userId, productId) {
        const [rows] = await this.db.execute(
            'SELECT COUNT(*) as count FROM product_reviews WHERE user_id = ? AND product_id = ?', [userId, productId]
        );
        return rows[0].count > 0;
    }
}

export default ProductReview;