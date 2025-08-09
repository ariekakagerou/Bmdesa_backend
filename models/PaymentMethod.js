import PaymentMethod from '../models/PaymentMethod.js';
import { Op } from 'sequelize';


class PaymentMethodController {
    // GET /api/payment-methods - Mendapatkan semua payment methods
    static async getAllPaymentMethods(req, res) {
        try {
            const { page = 1, limit = 10, type, search } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};

            // Filter berdasarkan type
            if (type) {
                whereClause.type = type;
            }

            // Search berdasarkan name
            if (search) {
                whereClause.name = {
                    [Op.iLike]: `%${search}%`
                };
            }

            const { count, rows } = await PaymentMethod.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [
                    ['name', 'ASC']
                ]
            });

            res.status(200).json({
                success: true,
                message: 'Payment methods retrieved successfully',
                data: {
                    paymentMethods: rows,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });
        } catch (error) {
            console.error('Error in getAllPaymentMethods:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // GET /api/payment-methods/:id - Mendapatkan payment method berdasarkan ID
    static async getPaymentMethodById(req, res) {
        try {
            const { id } = req.params;

            const paymentMethod = await PaymentMethod.findByPk(id);

            if (!paymentMethod) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment method not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Payment method retrieved successfully',
                data: paymentMethod
            });
        } catch (error) {
            console.error('Error in getPaymentMethodById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // POST /api/payment-methods - Membuat payment method baru
    static async createPaymentMethod(req, res) {
        try {
            const { name, type } = req.body;

            // Validasi input
            if (!name || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and type are required fields'
                });
            }

            // Cek apakah payment method dengan nama yang sama sudah ada
            const existingPaymentMethod = await PaymentMethod.findOne({
                where: { name }
            });

            if (existingPaymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment method with this name already exists'
                });
            }

            const newPaymentMethod = await PaymentMethod.create({
                name: name.trim(),
                type
            });

            res.status(201).json({
                success: true,
                message: 'Payment method created successfully',
                data: newPaymentMethod
            });
        } catch (error) {
            console.error('Error in createPaymentMethod:', error);

            // Handle Sequelize validation errors
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // PUT /api/payment-methods/:id - Update payment method
    static async updatePaymentMethod(req, res) {
        try {
            const { id } = req.params;
            const { name, type } = req.body;

            const paymentMethod = await PaymentMethod.findByPk(id);

            if (!paymentMethod) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment method not found'
                });
            }

            // Cek apakah nama baru sudah digunakan oleh payment method lain
            if (name && name !== paymentMethod.name) {
                const existingPaymentMethod = await PaymentMethod.findOne({
                    where: {
                        name,
                        method_id: {
                            [Op.ne]: id
                        }
                    }
                });

                if (existingPaymentMethod) {
                    return res.status(400).json({
                        success: false,
                        message: 'Payment method with this name already exists'
                    });
                }
            }

            // Update payment method
            const updatedData = {};
            if (name) updatedData.name = name.trim();
            if (type) updatedData.type = type;

            await paymentMethod.update(updatedData);

            res.status(200).json({
                success: true,
                message: 'Payment method updated successfully',
                data: paymentMethod
            });
        } catch (error) {
            console.error('Error in updatePaymentMethod:', error);

            // Handle Sequelize validation errors
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // DELETE /api/payment-methods/:id - Hapus payment method
    static async deletePaymentMethod(req, res) {
        try {
            const { id } = req.params;

            const paymentMethod = await PaymentMethod.findByPk(id);

            if (!paymentMethod) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment method not found'
                });
            }

            await paymentMethod.destroy();

            res.status(200).json({
                success: true,
                message: 'Payment method deleted successfully'
            });
        } catch (error) {
            console.error('Error in deletePaymentMethod:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // GET /api/payment-methods/types - Mendapatkan semua tipe payment method yang tersedia
    static async getPaymentMethodTypes(req, res) {
        try {
            const types = ['transfer', 'e-wallet', 'QRIS', 'cash'];

            res.status(200).json({
                success: true,
                message: 'Payment method types retrieved successfully',
                data: types
            });
        } catch (error) {
            console.error('Error in getPaymentMethodTypes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}


export default PaymentMethodController;