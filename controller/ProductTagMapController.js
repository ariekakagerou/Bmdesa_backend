import pkg from '../models/ProductTagMap.js';
const ProductTagMap = pkg;
import { Op } from 'sequelize';

class ProductTagMapController {

    static async getAllMappings(req, res) {
        try {
            const mappings = await ProductTagMap.findAll();
            res.status(200).json({
                success: true,
                data: mappings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching product-tag mappings',
                error: error.message
            });
        }
    }

    static async createMapping(req, res) {
        try {
            const { product_id, tag_id } = req.body;

            if (!product_id || !tag_id) {
                return res.status(400).json({
                    success: false,
                    message: 'product_id and tag_id are required'
                });
            }

            const existingMapping = await ProductTagMap.findOne({
                where: { product_id, tag_id }
            });

            if (existingMapping) {
                return res.status(409).json({
                    success: false,
                    message: 'Mapping already exists'
                });
            }

            const newMapping = await ProductTagMap.create({ product_id, tag_id });

            res.status(201).json({
                success: true,
                message: 'Product-tag mapping created successfully',
                data: newMapping
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating product-tag mapping',
                error: error.message
            });
        }
    }

    static async getTagsByProductId(req, res) {
        try {
            const { product_id } = req.params;

            const mappings = await ProductTagMap.findAll({
                where: { product_id }
            });

            res.status(200).json({
                success: true,
                data: mappings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching tags for product',
                error: error.message
            });
        }
    }

    static async getProductsByTagId(req, res) {
        try {
            const { tag_id } = req.params;

            const mappings = await ProductTagMap.findAll({
                where: { tag_id }
            });

            res.status(200).json({
                success: true,
                data: mappings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching products for tag',
                error: error.message
            });
        }
    }

    static async deleteMapping(req, res) {
        try {
            const { product_id, tag_id } = req.params;

            const deleted = await ProductTagMap.destroy({
                where: { product_id, tag_id }
            });

            if (deleted === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mapping not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product-tag mapping deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting product-tag mapping',
                error: error.message
            });
        }
    }

    static async bulkCreateMappings(req, res) {
        try {
            const { product_id, tag_ids } = req.body;

            if (!product_id || !Array.isArray(tag_ids) || tag_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'product_id and tag_ids array are required'
                });
            }

            await ProductTagMap.destroy({ where: { product_id } });

            const mappings = tag_ids.map(tag_id => ({
                product_id,
                tag_id
            }));

            const createdMappings = await ProductTagMap.bulkCreate(mappings);

            res.status(201).json({
                success: true,
                message: 'Product-tag mappings created successfully',
                data: createdMappings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating bulk product-tag mappings',
                error: error.message
            });
        }
    }

    static async deleteAllMappingsForProduct(req, res) {
        try {
            const { product_id } = req.params;

            const deleted = await ProductTagMap.destroy({
                where: { product_id }
            });

            res.status(200).json({
                success: true,
                message: `Deleted ${deleted} product-tag mappings`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting product-tag mappings',
                error: error.message
            });
        }
    }

    static async deleteAllMappingsForTag(req, res) {
        try {
            const { tag_id } = req.params;

            const deleted = await ProductTagMap.destroy({
                where: { tag_id }
            });

            res.status(200).json({
                success: true,
                message: `Deleted ${deleted} product-tag mappings`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting product-tag mappings',
                error: error.message
            });
        }
    }
}

export default ProductTagMapController;