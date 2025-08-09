import Wishlist from '../models/Wishlist.js';

const WishlistController = {
  // Get all wishlists
  getAllWishlists: async (req, res) => {
    try {
      const wishlists = await Wishlist.findAll();
      res.json(wishlists);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get wishlist by ID
  getWishlistById: async (req, res) => {
    try {
      const wishlist = await Wishlist.findByPk(req.params.id);
      if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
      res.json(wishlist);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create wishlist
  createWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.create(req.body);
      res.status(201).json(wishlist);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update wishlist
  updateWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findByPk(req.params.id);
      if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
      await wishlist.update(req.body);
      res.json(wishlist);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete wishlist
  deleteWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findByPk(req.params.id);
      if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
      await wishlist.destroy();
      res.json({ message: 'Wishlist deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default WishlistController;