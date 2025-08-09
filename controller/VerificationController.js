import Verification from '../models/Verification.js';

// Konfigurasi database
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'your_database_name',
    port: process.env.DB_PORT || 3306
};

const verificationModel = new Verification(dbConfig);

class VerificationController {
    
    // Membuat kode verifikasi baru
    async createVerification(req, res) {
        try {
            const { identifier, jenis, penyortiran, expires_in_minutes = 15 } = req.body;

            // Validasi input
            if (!identifier) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifier is required'
                });
            }

            // Cek apakah sudah ada verifikasi aktif untuk identifier ini
            const existingVerification = await verificationModel.findByIdentifier(identifier);
            if (existingVerification && !verificationModel.isExpired(existingVerification)) {
                return res.status(409).json({
                    success: false,
                    message: 'Active verification already exists for this identifier'
                });
            }

            // Generate kode verifikasi
            const code = verificationModel.generateVerificationCode();
            const expires_at = verificationModel.setExpirationTime(expires_in_minutes);

            const verificationData = {
                identifier,
                code,
                jenis: jenis || 'email', // default jenis
                penyortiran: penyortiran || null,
                expires_at
            };

            const result = await verificationModel.create(verificationData);

            res.status(201).json({
                success: true,
                message: 'Verification code created successfully',
                data: {
                    id: result.id,
                    identifier: result.identifier,
                    code: result.code,
                    jenis: result.jenis,
                    expires_at: result.expires_at
                }
            });

        } catch (error) {
            console.error('Error creating verification:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Memverifikasi kode
    async verifyCode(req, res) {
        try {
            const { identifier, code } = req.body;

            // Validasi input
            if (!identifier || !code) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifier and code are required'
                });
            }

            // Cari verifikasi berdasarkan identifier dan code
            const verification = await verificationModel.findByIdentifierAndCode(identifier, code);

            if (!verification) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid verification code'
                });
            }

            // Cek apakah kode sudah expired
            if (verificationModel.isExpired(verification)) {
                // Hapus kode yang sudah expired
                await verificationModel.delete(verification.id);
                return res.status(410).json({
                    success: false,
                    message: 'Verification code has expired'
                });
            }

            // Verifikasi berhasil, hapus kode verifikasi
            await verificationModel.delete(verification.id);

            res.status(200).json({
                success: true,
                message: 'Verification successful',
                data: {
                    identifier: verification.identifier,
                    jenis: verification.jenis,
                    verified_at: new Date()
                }
            });

        } catch (error) {
            console.error('Error verifying code:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan semua verifikasi (untuk admin)
    async getAllVerifications(req, res) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            const verifications = await verificationModel.findAll(
                parseInt(limit), 
                parseInt(offset)
            );

            res.status(200).json({
                success: true,
                message: 'Verifications retrieved successfully',
                data: verifications,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    count: verifications.length
                }
            });

        } catch (error) {
            console.error('Error getting all verifications:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan verifikasi berdasarkan ID
    async getVerificationById(req, res) {
        try {
            const { id } = req.params;

            const verification = await verificationModel.findById(id);

            if (!verification) {
                return res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Verification retrieved successfully',
                data: verification
            });

        } catch (error) {
            console.error('Error getting verification by ID:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mendapatkan verifikasi berdasarkan identifier
    async getVerificationByIdentifier(req, res) {
        try {
            const { identifier } = req.params;

            const verification = await verificationModel.findByIdentifier(identifier);

            if (!verification) {
                return res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Verification retrieved successfully',
                data: {
                    id: verification.id,
                    identifier: verification.identifier,
                    jenis: verification.jenis,
                    expires_at: verification.expires_at,
                    is_expired: verificationModel.isExpired(verification)
                }
            });

        } catch (error) {
            console.error('Error getting verification by identifier:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Menghapus verifikasi
    async deleteVerification(req, res) {
        try {
            const { id } = req.params;

            const deleted = await verificationModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Verification deleted successfully'
            });

        } catch (error) {
            console.error('Error deleting verification:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update status verifikasi
    async updateVerificationStatus(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedVerification = await verificationModel.update(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Verification updated successfully',
                data: updatedVerification
            });

        } catch (error) {
            console.error('Error updating verification:', error);
            
            if (error.message === 'Verification not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Membersihkan verifikasi yang expired (bisa dipanggil dengan cron job)
    async cleanupExpiredVerifications(req, res) {
        try {
            const deletedCount = await verificationModel.deleteExpired();

            res.status(200).json({
                success: true,
                message: `Cleaned up ${deletedCount} expired verifications`
            });

        } catch (error) {
            console.error('Error cleaning up expired verifications:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

export default new VerificationController();