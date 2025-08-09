import express from 'express';
import ProductTagController from '../controller/ProductTagController.js';

const router = express.Router();

// Middleware untuk validasi input (opsional)
const validateTagInput = (req, res, next) => {
  const { name } = req.body;

  if (name && typeof name !== 'string') {
    return res.status(400).json({ success: false, message: 'Name must be a string' });
  }

  if (name && name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name cannot be empty' });
  }

  if (name && name.length > 50) {
    return res.status(400).json({ success: false, message: 'Name cannot exceed 50 characters' });
  }

  // Bersihkan whitespace
  if (name) {
    req.body.name = name.trim();
  }

  next();
};

// Routes
router.get('/', ProductTagController.getAllTags);
router.get('/search', ProductTagController.searchTags);
router.get('/:id', ProductTagController.getTagById);
router.post('/', validateTagInput, ProductTagController.createTag);
router.put('/:id', validateTagInput, ProductTagController.updateTag);
router.delete('/:id', ProductTagController.deleteTag);

// ✅ Gunakan export default untuk mendukung `import ... from ...`
export default router;
