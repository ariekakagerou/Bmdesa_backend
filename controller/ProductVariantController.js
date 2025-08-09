import db from '../config/db.js';

class ProductVariantController {
  // Get all product variants
  static async getAllVariants(req, res) {
    try {
      const [variants] = await db.query('SELECT * FROM product_variants');
      res.status(200).json({
        success: true,
        message: 'Product variants retrieved successfully',
        data: variants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving product variants',
        error: error.message
      });
    }
  }

  // Get product variant by ID
  static async getVariantById(req, res) {
    try {
      const { id } = req.params;
      const [variant] = await db.query('SELECT * FROM product_variants WHERE variant_id = ?', [id]);

      if (variant.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product variant not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Product variant retrieved successfully',
        data: variant[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving product variant',
        error: error.message
      });
    }
  }

  // Get variants by product ID
  static async getVariantsByProductId(req, res) {
    try {
      const { productId } = req.params;
      const [variants] = await db.query(
        'SELECT * FROM product_variants WHERE product_id = ? ORDER BY variant_name ASC, variant_value ASC',
        [productId]
      );

      res.status(200).json({
        success: true,
        message: 'Product variants retrieved successfully',
        data: variants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving product variants',
        error: error.message
      });
    }
  }

  // Create new product variant
  static async createVariant(req, res) {
    try {
      const { product_id, variant_name, variant_value, stock, price } = req.body;

      if (!product_id || !variant_name || !variant_value || stock === undefined || !price) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: product_id, variant_name, variant_value, stock, price'
        });
      }

      // Cek jika sudah ada
      const [exists] = await db.query(
        'SELECT * FROM product_variants WHERE product_id = ? AND variant_name = ? AND variant_value = ?',
        [product_id, variant_name, variant_value]
      );

      if (exists.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Product variant already exists'
        });
      }

      const [result] = await db.query(
        'INSERT INTO product_variants (product_id, variant_name, variant_value, stock, price) VALUES (?, ?, ?, ?, ?)',
        [product_id, variant_name, variant_value, stock, price]
      );

      const [newVariant] = await db.query('SELECT * FROM product_variants WHERE variant_id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Product variant created successfully',
        data: newVariant[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating product variant',
        error: error.message
      });
    }
  }

  // Update product variant
  static async updateVariant(req, res) {
    try {
      const { id } = req.params;
      const { variant_name, variant_value, stock, price } = req.body;

      const [variant] = await db.query('SELECT * FROM product_variants WHERE variant_id = ?', [id]);

      if (variant.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product variant not found'
        });
      }

      const fields = [];
      const values = [];

      if (variant_name !== undefined) {
        fields.push('variant_name = ?');
        values.push(variant_name);
      }
      if (variant_value !== undefined) {
        fields.push('variant_value = ?');
        values.push(variant_value);
      }
      if (stock !== undefined) {
        fields.push('stock = ?');
        values.push(stock);
      }
      if (price !== undefined) {
        fields.push('price = ?');
        values.push(price);
      }

      if (fields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields provided to update'
        });
      }

      values.push(id); // untuk WHERE clause

      await db.query(`UPDATE product_variants SET ${fields.join(', ')} WHERE variant_id = ?`, values);

      const [updatedVariant] = await db.query('SELECT * FROM product_variants WHERE variant_id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Product variant updated successfully',
        data: updatedVariant[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating product variant',
        error: error.message
      });
    }
  }

  // Update stock
  static async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stock, operation } = req.body;

      const [variantRows] = await db.query('SELECT * FROM product_variants WHERE variant_id = ?', [id]);

      if (variantRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product variant not found'
        });
      }

      const variant = variantRows[0];
      let newStock = variant.stock;

      switch (operation) {
        case 'add':
          newStock += stock;
          break;
        case 'subtract':
          newStock = Math.max(0, newStock - stock);
          break;
        case 'set':
        default:
          newStock = stock;
          break;
      }

      await db.query('UPDATE product_variants SET stock = ? WHERE variant_id = ?', [newStock, id]);

      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: {
          variant_id: variant.variant_id,
          old_stock: variant.stock,
          new_stock: newStock
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating stock',
        error: error.message
      });
    }
  }

  // Delete product variant
  static async deleteVariant(req, res) {
    try {
      const { id } = req.params;

      const [variant] = await db.query('SELECT * FROM product_variants WHERE variant_id = ?', [id]);

      if (variant.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product variant not found'
        });
      }

      await db.query('DELETE FROM product_variants WHERE variant_id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Product variant deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product variant',
        error: error.message
      });
    }
  }

  // Get low stock variants
  static async getLowStockVariants(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 10;

      const [variants] = await db.query(
        'SELECT * FROM product_variants WHERE stock <= ? ORDER BY stock ASC',
        [threshold]
      );

      res.status(200).json({
        success: true,
        message: 'Low stock variants retrieved successfully',
        data: variants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving low stock variants',
        error: error.message
      });
    }
  }
}

export default ProductVariantController;
