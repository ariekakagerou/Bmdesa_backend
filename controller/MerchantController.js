import dotenv from 'dotenv';
dotenv.config();

import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import authenticate from '../middleware/auth.js';

// Setup penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads/merchant_docs';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + uuidv4();
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file JPG, PNG, dan PDF yang diperbolehkan!'));
        }
    }
}).fields([
    { name: 'id_card_photo', maxCount: 1 },
    { name: 'selfie_with_id_photo', maxCount: 1 }
]);

// ✅ Ajukan Merchant
export const applyForMerchant = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }

            const user_id = req.user.user_id;

            const [userCheck] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
            if (userCheck.length === 0 || userCheck[0].role !== 'user') {
                return res.status(403).json({
                    success: false,
                    message: 'Anda harus terdaftar sebagai user untuk mengajukan merchant'
                });
            }

            const [existingMerchant] = await db.query(
                'SELECT * FROM merchants WHERE user_id = ?', [user_id]
            );

            if (existingMerchant.length > 0) {
                const status = existingMerchant[0].verification_status;
                if (['pending', 'approved'].includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: status === 'pending'
                            ? 'Permintaan pendaftaran merchant Anda sedang diproses'
                            : 'Anda sudah terdaftar sebagai merchant'
                    });
                } else if (status === 'rejected') {
                    return res.status(400).json({
                        success: false,
                        message: 'Aplikasi sebelumnya ditolak. Alasan: ${existingMerchant[0].rejection_reason}. Silakan ajukan ulang dengan perbaikan.'
                    });
                }
            }

            const {
                merchant_type, national_id_number, id_card_issued_date, id_card_expiry_date,
                business_name, business_address, business_license,
                company_name, company_registration_number, tax_id,
                bank_account_name, bank_account_number, bank_name, bio
            } = req.body;

            if (!merchant_type || !(['individual', 'company'].includes(merchant_type))) {
                return res.status(400).json({ success: false, message: 'Jenis merchant tidak valid' });
            }

            if (!national_id_number || !id_card_issued_date || !id_card_expiry_date ||
                !business_name || !business_address || !bank_account_name ||
                !bank_account_number || !bank_name) {
                return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
            }

            if (merchant_type === 'company' &&
                (!company_name || !company_registration_number || !tax_id || !business_license)) {
                return res.status(400).json({ success: false, message: 'Field perusahaan wajib diisi' });
            }

            if (!req.files.id_card_photo || !req.files.selfie_with_id_photo) {
                return res.status(400).json({ success: false, message: 'Foto KTP dan selfie wajib diunggah' });
            }

            const id_card_photo = req.files.id_card_photo[0].path;
            const selfie_with_id_photo = req.files.selfie_with_id_photo[0].path;

            await db.query(
                `INSERT INTO merchants (
                    user_id, merchant_type, national_id_number, id_card_photo, selfie_with_id_photo,
                    id_card_issued_date, id_card_expiry_date, business_name, business_address,
                    business_license, company_name, company_registration_number, tax_id,
                    bank_account_name, bank_account_number, bank_name, bio,
                    verification_status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
                [
                    user_id, merchant_type, national_id_number, id_card_photo, selfie_with_id_photo,
                    id_card_issued_date, id_card_expiry_date, business_name, business_address,
                    business_license || null, company_name || null, company_registration_number || null, tax_id || null,
                    bank_account_name, bank_account_number, bank_name, bio || null
                ]
            );

            res.status(201).json({
                success: true,
                message: 'Permohonan merchant berhasil diajukan'
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengajukan merchant', error: error.message });
    }
};

// ✅ Cek status pengajuan
export const getMerchantStatus = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const [merchant] = await db.query(
            'SELECT verification_status, rejection_reason FROM merchants WHERE user_id = ?', [user_id]
        );

        if (merchant.length === 0) {
            return res.status(404).json({ success: false, message: 'Belum mengajukan merchant' });
        }

        res.status(200).json({
            success: true,
            status: merchant[0].verification_status,
            rejection_reason: merchant[0].rejection_reason || null
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mendapatkan status', error: error.message });
    }
};

// ✅ Admin: semua pengajuan
export const getAllMerchantApplications = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Hanya admin yang boleh' });
        }

        const status = req.query.status || 'pending';

        const [applications] = await db.query(
            `SELECT m.*, u.name, u.email, u.phone 
             FROM merchants m 
             JOIN users u ON m.user_id = u.user_id 
             WHERE m.verification_status = ?
             ORDER BY m.created_at DESC`, [status]
        );

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data', error: error.message });
    }
};

// ✅ Admin: proses approve / reject
export const processMerchantApplication = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Hanya admin yang boleh' });
        }

        const { id, action, rejection_reason } = req.body;
        if (!id || !action || !['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'ID dan aksi wajib diisi' });
        }

        if (action === 'reject' && !rejection_reason) {
            return res.status(400).json({ success: false, message: 'Alasan penolakan wajib' });
        }

        // Cari merchant application
        const [merchantCheck] = await db.query('SELECT * FROM merchants WHERE id = ?', [id]);
        if (merchantCheck.length === 0) {
            return res.status(404).json({ success: false, message: 'Merchant tidak ditemukan' });
        }

        const user_id = merchantCheck[0].user_id;

        if (action === 'approve') {
            // Setujui: update status merchant dan role user
            await db.query(
                'UPDATE merchants SET verification_status = ?, updated_at = NOW() WHERE id = ?', ['approved', id]
            );
            await db.query(
                'UPDATE users SET role = ?, status = ? WHERE user_id = ?', ['merchant', 'active', user_id]
            );
            return res.status(200).json({ success: true, message: 'User berhasil diverifikasi sebagai merchant' });
        } else {
            // Tolak: update status merchant dan simpan alasan
            await db.query(
                'UPDATE merchants SET verification_status = ?, rejection_reason = ?, updated_at = NOW() WHERE id = ?',
                ['rejected', rejection_reason, id]
            );
            await db.query(
                'UPDATE users SET status = ? WHERE user_id = ?', ['inactive', user_id]
            );
            return res.status(200).json({ success: true, message: 'Verifikasi merchant ditolak', catatan: rejection_reason });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal memproses aplikasi', error: error.message });
    }
};

// ✅ Ambil profil merchant
export const getMerchantProfile = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        if (req.user.role !== 'merchant') {
            return res.status(403).json({ success: false, message: 'Bukan merchant' });
        }

        const [merchant] = await db.query(
            'SELECT * FROM merchants WHERE user_id = ? AND verification_status = "approved"', [user_id]
        );

        if (merchant.length === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }

        const merchantData = { ...merchant[0] };
        delete merchantData.id_card_photo;
        delete merchantData.selfie_with_id_photo;

        res.status(200).json({ success: true, data: merchantData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mendapatkan profil', error: error.message });
    }
};

// ✅ Update profil merchant
export const updateMerchantProfile = async (req, res) => {
    try {
        if (req.user.role !== 'merchant') {
            return res.status(403).json({ success: false, message: 'Bukan merchant' });
        }

        const user_id = req.user.user_id;
        const {
            business_name, business_address,
            bank_account_name, bank_account_number, bank_name, bio
        } = req.body;

        if (!business_name || !business_address || !bank_account_name ||
            !bank_account_number || !bank_name) {
            return res.status(400).json({ success: false, message: 'Field wajib diisi' });
        }

        await db.query(
            `UPDATE merchants 
             SET business_name = ?, business_address = ?, 
                 bank_account_name = ?, bank_account_number = ?, bank_name = ?, 
                 bio = ?, updated_at = NOW()
             WHERE user_id = ?`,
            [business_name, business_address, bank_account_name, bank_account_number, bank_name, bio || null, user_id]
        );

        res.status(200).json({ success: true, message: 'Profil merchant diperbarui' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal update profil', error: error.message });
    }
};