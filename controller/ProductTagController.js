// ProductTagController.js - Controller
import ProductTag from '../models/ProductTag.js';
import { Op } from 'sequelize';

const ProductTagController = {
    // Get all product tags
    async getAllTags(req, res) {
        try {
            const tags = await ProductTag.findAll({
                order: [
                    ['tag_id', 'ASC']
                ]
            });

            res.status(200).json({
                success: true,
                message: 'Product tags retrieved successfully',
                data: tags
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving product tags',
                error: error.message
            });
        }
    },

    // Get single product tag by ID
    async getTagById(req, res) {
        try {
            const { id } = req.params;
            const tag = await ProductTag.findByPk(id);

            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Product tag not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product tag retrieved successfully',
                data: tag
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving product tag',
                error: error.message
            });
        }
    },

    // Create new product tag
    async createTag(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required'
                });
            }

            // Check if tag with same name already exists
            const existingTag = await ProductTag.findOne({ where: { name } });
            if (existingTag) {
                return res.status(409).json({
                    success: false,
                    message: 'Product tag with this name already exists'
                });
            }

            const newTag = await ProductTag.create({ name });

            res.status(201).json({
                success: true,
                message: 'Product tag created successfully',
                data: newTag
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating product tag',
                error: error.message
            });
        }
    },

    // Update product tag
    async updateTag(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required'
                });
            }

            const tag = await ProductTag.findByPk(id);
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Product tag not found'
                });
            }

            // Check if another tag with same name already exists
            const existingTag = await ProductTag.findOne({
                where: {
                    name,
                    tag_id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existingTag) {
                return res.status(409).json({
                    success: false,
                    message: 'Product tag with this name already exists'
                });
            }

            await tag.update({ name });

            res.status(200).json({
                success: true,
                message: 'Product tag updated successfully',
                data: tag
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating product tag',
                error: error.message
            });
        }
    },

    // Delete product tag
    async deleteTag(req, res) {
        try {
            const { id } = req.params;

            const tag = await ProductTag.findByPk(id);
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Product tag not found'
                });
            }

            await tag.destroy();

            res.status(200).json({
                success: true,
                message: 'Product tag deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting product tag',
                error: error.message
            });
        }
    },

    // Search product tags by name
    async searchTags(req, res) {
        try {
            const { name } = req.query;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Search name parameter is required'
                });
            }

            const tags = await ProductTag.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
                order: [
                    ['name', 'ASC']
                ]
            });

            res.status(200).json({
                success: true,
                message: 'Product tags search completed',
                data: tags
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error searching product tags',
                error: error.message
            });
        }
    }
};

export default ProductTagController;