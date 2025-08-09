// wishlistRoutes.js (versi ESM)
import express from 'express';
import WishlistController from '../controller/WishlistController.js'; // pastikan controller-nya pakai export default

const router = express.Router();

// GET all wishlists
router.get('/', WishlistController.getAllWishlists);

// GET wishlist by id
router.get('/:id', WishlistController.getWishlistById);

// POST create wishlist
router.post('/', WishlistController.createWishlist);

// PUT update wishlist
router.put('/:id', WishlistController.updateWishlist);

// DELETE wishlist
router.delete('/:id', WishlistController.deleteWishlist);

// ✅ Export sebagai default
export default router;
