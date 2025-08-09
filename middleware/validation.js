import { body, validationResult } from 'express-validator';

// Helper untuk menangani hasil validasi
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validasi Pendaftaran Pengguna
const validateUserRegistration = [
    body('name')
    .notEmpty()
    .withMessage('Nama wajib diisi'),
    body('email')
    .isEmail()
    .withMessage('Email yang valid wajib diisi'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password harus memiliki minimal 6 karakter'),
    body('role')
    .isIn(['admin', 'user', 'merchant'])
    .withMessage('Role tidak valid'),
    handleValidation
];

// Validasi Pembuatan Unit Bisnis
const validateBusinessUnit = [
    body('name')
    .notEmpty()
    .withMessage('Nama unit bisnis wajib diisi'),
    body('description')
    .optional()
    .isString()
    .withMessage('Deskripsi harus berupa teks'),
    body('manager_id')
    .optional()
    .isInt()
    .withMessage('Manager ID harus berupa angka'),
    handleValidation
];

// Validasi Pembuatan/Pembaruan Produk
const validateProduct = [
    body('unit_id')
    .isInt()
    .withMessage('Unit ID yang valid wajib diisi'),
    body('name')
    .notEmpty()
    .withMessage('Nama produk wajib diisi'),
    body('price')
    .isDecimal()
    .withMessage('Harga produk yang valid wajib diisi'),
    body('stock')
    .isInt({ min: 0 })
    .withMessage('Stok harus berupa angka positif'),
    handleValidation
];

// Validasi Pembuatan/Pembaruan Properti
const validateProperty = [
    body('unit_id')
    .isInt()
    .withMessage('Unit ID yang valid wajib diisi'),
    body('name')
    .notEmpty()
    .withMessage('Nama properti wajib diisi'),
    body('location')
    .notEmpty()
    .withMessage('Lokasi wajib diisi'),
    body('price')
    .isDecimal()
    .withMessage('Harga properti yang valid wajib diisi'),
    body('status')
    .isIn(['available', 'rented', 'maintenance'])
    .withMessage('Status tidak valid'),
    handleValidation
];

export const validateMerchantApplication = (req, res, next) => {
    const { merchant_type, national_id_number, business_name, business_address } = req.body;

    if (!merchant_type || !national_id_number || !business_name || !business_address) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    next();
};

export {
    validateUserRegistration,
    validateBusinessUnit,
    validateProduct,
    validateProperty
};