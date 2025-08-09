import express from 'express';
import ProductVariantController from '../controller/ProductVariantController.js';

const router = express.Router();

// Validation middleware
const validateVariantData = (req, res, next) => {
  const { product_id, variant_name, variant_value, stock, price } = req.body;
  
  const errors = [];

  if (req.method === 'POST') {
    if (!product_id) errors.push('product_id is required');
    if (!variant_name) errors.push('variant_name is required');
    if (!variant_value) errors.push('variant_value is required');
    if (stock === undefined || stock === null) errors.push('stock is required');
    if (!price) errors.push('price is required');
  }

  if (variant_name && variant_name.length > 100) {
    errors.push('variant_name must be 100 characters or less');
  }

  if (variant_value && variant_value.length > 100) {
    errors.push('variant_value must be 100 characters or less');
  }

  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    errors.push('stock must be a non-negative number');
  }

  if (price !== undefined && (isNaN(price) || price < 0)) {
    errors.push('price must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Middleware to validate ID parameter
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter'
    });
  }
  
  next();
};

// Routes
router.get('/', ProductVariantController.getAllVariants);
router.get('/low-stock', ProductVariantController.getLowStockVariants);
router.get('/:id', validateId, ProductVariantController.getVariantById);
router.get('/product/:productId', ProductVariantController.getVariantsByProductId);
router.post('/', validateVariantData, ProductVariantController.createVariant);
router.put('/:id', validateId, validateVariantData, ProductVariantController.updateVariant);

// PATCH untuk stok
router.patch('/:id/stock', validateId, (req, res, next) => {
  const { stock, operation } = req.body;

  if (stock === undefined || isNaN(stock)) {
    return res.status(400).json({
      success: false,
      message: 'stock is required and must be a number'
    });
  }

  if (operation && !['set', 'add', 'subtract'].includes(operation)) {
    return res.status(400).json({
      success: false,
      message: 'operation must be one of: set, add, subtract'
    });
  }

  next();
}, ProductVariantController.updateStock);

router.delete('/:id', validateId, ProductVariantController.deleteVariant);

// ✅ Export default untuk mendukung import ESM
export default router;
