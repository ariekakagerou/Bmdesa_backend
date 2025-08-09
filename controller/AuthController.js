import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import * as wa from '../utils/wa.js';
import UserLog from '../models/UserLog.js'; // Tambahkan ini di atas
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { sendMessage } from '../utils/wa.js';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buatToken = (user) => jwt.sign({
    user_id: user.user_id,
    name: user.name,
    role: user.role
}, process.env.JWT_SECRET, { expiresIn: '1d' });

const buatOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const formatNomorHP = (no) => {
    if (!no) return null;
    if (no.startsWith('+')) return no;
    if (no.startsWith('62')) return `+${no}`;
    if (no.startsWith('0')) return `+62${no.slice(1)}`;
    return null;
};

const kirimOtpEmail = async(email, otp, nama = 'Pengguna', jenis = 'verifikasi akun') => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center; background-color: #008c45; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">BUMDesa Semplak Barat</h1>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #008c45; margin-bottom: 20px;">Kode OTP ${jenis}</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Halo <strong>${nama}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">Kami menerima permintaan untuk <strong>${jenis}</strong>.</p>
                    <p style="font-size: 16px; line-height: 1.6;">Berikut adalah kode OTP Anda:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; background-color: #008c45; color: white; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                            ${otp}
                        </div>
                    </div>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            <strong>⚠️ Penting:</strong> Kode ini hanya berlaku selama <strong>5 menit</strong>. 
                            Jangan bagikan kepada siapa pun.
                        </p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        Jika Anda tidak melakukan permintaan ini, abaikan pesan ini.
                    </p>
                </div>
                <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">
                        © 2024 BUMDesa Semplak Barat. Semua hak dilindungi.
                    </p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"BUMDesa Semplak Barat" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: `🔐 Kode OTP untuk ${jenis} - BUMDesa Semplak Barat`,
            html: html,
            text: `Kode OTP Anda adalah: ${otp}\n\nKode ini berlaku selama 5 menit.\n\nBUMDesa Semplak Barat`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email OTP terkirim ke ${email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ Error kirim email OTP:', error);
        throw new Error(`Gagal mengirim email: ${error.message}`);
    }
};

const kirimOtpWa = async(hp, otp, nama = 'Pengguna', jenis = 'verifikasi akun') => {
    try {
        const pesan = `🔐 *KODE OTP ${jenis.toUpperCase()}*

Halo ${nama}! 

Kode OTP Anda adalah:
*${otp}*

⏰ Kode ini berlaku selama 5 menit.
🔒 Jangan bagikan kode ini kepada siapapun.

Terima kasih,
Tim BUMDes Semplak Barat`;

        await sendMessage(hp, pesan);
        console.log(`✅ OTP WhatsApp terkirim ke ${hp}`);
        return true;
    } catch (error) {
        console.error('❌ Error kirim OTP WhatsApp:', error.message);
        // Jangan throw error, biarkan proses lanjut
        return false;
    }
};


// Fungsi untuk generate kode unik user_id sesuai role
const rolePrefix = {
    admin: 'ADM',
    manager: 'MGR',
    staff: 'STF',
    customer: 'CST',
    user: 'USR',
    courier: 'CUR',
    merchant: 'MCH',
    finance: 'FIN',
    dispatcher: 'DSP',
    visitor: 'VST',
    editor: 'EDT',
    cashier: 'CSH',
    chairman: 'CHM'
};

const buatKodeUnik = (role, tahun = null, nomor) => {
    const kode = rolePrefix[role] || 'UNK';
    const thn = (tahun || new Date().getFullYear()).toString().slice(-2);
    const no = nomor.toString().padStart(5, '0');
    return `${kode}${thn}${no}`;
};

// ========== REGISTRASI ==========
export const register = async(req, res) => {
    try {
        let {
            name,
            username,
            email,
            phone,
            password,
            jenis_kelamin,
            tanggal_lahir,
            address = 'Belum diisi',
            role = 'customer',
            status = 'inactive',
            identifier
        } = req.body;

        // Pastikan role default adalah 'customer' jika tidak diberikan atau jika platform adalah pendaftaran umum
        if (!role || role === '' || role === undefined || role === null) {
            role = 'customer';
        }
        // Untuk pendaftaran umum (tanpa role eksplisit), paksa prefix user_id ke 'CST'
        let user_id_role = role;
        if (!req.body.role || req.body.role === '' || req.body.role === undefined || req.body.role === null) {
            user_id_role = 'customer';
        }

        // Jika identifier ada, mapping ke email/phone sesuai format
        if (identifier) {
            if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(identifier)) {
                email = identifier;
            } else if (/^[0-9]{10,13}$/.test(identifier)) {
                phone = identifier;
            }
        }

        // Validasi field wajib
        if (!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, username, dan password wajib diisi.'
            });
        }

        // Validasi email atau phone harus ada salah satu
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Email atau nomor telepon wajib diisi.'
            });
        }

        // Cek duplikasi data
        const [cek] = await db.query(
            `SELECT * FROM users WHERE email = ? OR phone = ? OR username = ?`, [email || '', phone || '', username]
        );

        if (cek.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email, username, atau nomor telepon sudah digunakan.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user baru
        const [hasil] = await db.query(`
            INSERT INTO users (
                name, 
                username, 
                email, 
                phone, 
                password, 
                jenis_kelamin, 
                tanggal_lahir, 
                address, 
                role, 
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name,
            username,
            email || null,
            phone || null,
            hashedPassword,
            jenis_kelamin || null,
            tanggal_lahir || null,
            address,
            role,
            status
        ]);

        // Generate user_id unik sesuai role (atau paksa 'customer' jika pendaftaran umum)
        const user_id = buatKodeUnik(user_id_role, null, hasil.insertId);
        await db.query(`UPDATE users SET user_id = ? WHERE id = ?`, [user_id, hasil.insertId]);

        // Generate OTP dan simpan ke tabel verifications
        const otp = buatOTP();
        const finalIdentifier = email || phone;
        const type = email ? 'email' : 'whatsapp';
        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

        // Hapus verifikasi lama jika ada
        await db.query(`DELETE FROM verifications WHERE identifier = ? AND type = ?`, [finalIdentifier, type]);

        // Insert verifikasi baru
        await db.query(`
            INSERT INTO verifications (identifier, code, type, expires_at)
            VALUES (?, ?, ?, ?)
        `, [finalIdentifier, otp, type, expires_at]);

        // Kirim OTP
        console.log('Akan mengirim OTP ke:', email || phone, 'Kode:', otp);

        let otpSent = false;
        try {
            if (email) {
                await kirimOtpEmail(email, otp, name, 'verifikasi akun');
                console.log('OTP dikirim ke email:', email);
                otpSent = true;
            } else if (phone) {
                const waResult = await kirimOtpWa(phone, otp, name, 'verifikasi akun');
                console.log('OTP dikirim ke WhatsApp:', phone);
                otpSent = waResult;
            }
        } catch (otpError) {
            console.error('Error kirim OTP:', otpError);
            // Lanjutkan meski OTP gagal dikirim
        }

        // Update status user menjadi active setelah OTP terkirim
        await db.query(`UPDATE users SET status = 'active' WHERE id = ?`, [hasil.insertId]);

        res.status(201).json({
            success: true,
            message: otpSent ?
                'Registrasi berhasil. OTP telah dikirim untuk verifikasi.' : 'Registrasi berhasil. OTP disimpan di database.',
            data: {
                id: hasil.insertId,
                user_id: user_id,
                name,
                username,
                email,
                phone,
                role,
                status: 'active',
                otp_sent: otpSent,
                otp_code: otpSent ? null : otp // Tampilkan OTP jika gagal dikirim (untuk testing)
            }
        });
    } catch (err) {
        console.error('Error registrasi:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal registrasi',
            error: err.message
        });
    }
};

// ========== LOGIN ==========
export const login = async(req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Email/HP dan password wajib.' });
    }

    try {
        const [users] = await db.query(
            `SELECT * FROM users WHERE email = ? OR phone = ? OR username = ?`, [identifier, identifier, identifier]
        );
        const user = users[0];

        if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Password salah.' });

        if (user.status === 'verify') {
            // Generate OTP dan simpan ke DB
            const otp = buatOTP();
            const type = user.email ? 'email' : 'whatsapp';
            const identifierVal = user.email || user.phone;
            const expires_at = new Date(Date.now() + 5 * 60 * 1000);

            await db.query(`DELETE FROM verifications WHERE identifier = ? AND type = ?`, [identifierVal, type]);
            await db.query(`INSERT INTO verifications (identifier, code, type, expires_at) VALUES (?, ?, ?, ?)`, [identifierVal, otp, type, expires_at]);

            // Kirim response ke frontend DULU
            res.status(200).json({
                success: true,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    role: user.role,
                    status: 'verify'
                }
            });

            // Kirim OTP di background (tidak blocking response)
            (async() => {
                try {
                    if (user.email) {
                        await kirimOtpEmail(user.email, otp, user.name, 'verifikasi akun');
                    } else if (user.phone) {
                        await kirimOtpWa(user.phone, otp, user.name, 'verifikasi akun');
                    }
                } catch (e) {
                    console.error('Error kirim OTP async:', e);
                }
            })();
            return;
        } else if (user.status === 'active') {
            // Lanjutkan login seperti biasa
            const token = buatToken(user);
            await UserLog.create({
                user_id: user.user_id || user.id.toString(),
                action: 'login',
                ip_address: req.ip,
                device_info: req.headers['user-agent'] || ''
            });
            res.status(200).json({
                success: true,
                token,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    role: user.role,
                    status: 'active'
                }
            });
        }
    } catch (err) {
        console.error('Error login:', err);
        res.status(500).json({ message: 'Login gagal', error: err.message });
    }
};

// ========== VERIFIKASI OTP ==========
export const verifyOtp = async(req, res) => {
    const { identifier, otp, method } = req.body;
    if (!identifier || !otp || !method) {
        return res.status(400).json({
            success: false,
            message: 'Identifier, OTP, dan method wajib diisi.'
        });
    }

    try {
        // Cek verifikasi di tabel verifications
        const type = method === 'email' ? 'email' : 'whatsapp';
        const [verificationData] = await db.query(`
            SELECT * FROM verifications 
            WHERE identifier = ? AND code = ? AND type = ?
            ORDER BY created_at DESC 
            LIMIT 1
        `, [identifier, otp, type]);

        if (verificationData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'OTP salah.'
            });
        }

        const verification = verificationData[0];

        // Cek apakah OTP sudah expired
        if (new Date(verification.expires_at) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'OTP sudah kedaluwarsa.'
            });
        }

        // Cari user berdasarkan identifier
        const kolom = method === 'email' ? 'email' : 'phone';
        const [userData] = await db.query(`SELECT * FROM users WHERE ${kolom} = ?`, [identifier]);

        if (userData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        const user = userData[0];

        // Update status user menjadi active
        await db.query(`UPDATE users SET status = ? WHERE id = ?`, ['active', user.id]);

        // Hapus verifikasi yang sudah digunakan
        await db.query(`DELETE FROM verifications WHERE id = ?`, [verification.id]);

        // Generate token
        const token = buatToken(user);

        res.status(200).json({
            success: true,
            message: 'Verifikasi berhasil',
            data: {
                token,
                user: {
                    id: user.id,
                    user_id: user.user_id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    status: 'active'
                }
            }
        });
    } catch (err) {
        console.error('Error verifikasi OTP:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal verifikasi',
            error: err.message
        });
    }
};

// ========== KIRIM ULANG OTP ==========
export const resendOtp = async(req, res) => {
    const { identifier, method } = req.body;
    if (!identifier || !method) {
        return res.status(400).json({
            success: false,
            message: 'Identifier dan method wajib diisi.'
        });
    }

    try {
        // Cek apakah user exists
        const kolom = method === 'email' ? 'email' : 'phone';
        const [userData] = await db.query(`SELECT * FROM users WHERE ${kolom} = ?`, [identifier]);

        if (userData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        const user = userData[0];

        // Generate OTP baru
        const otp = buatOTP();
        const type = method === 'email' ? 'email' : 'whatsapp';
        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

        // Hapus verifikasi lama
        await db.query(`DELETE FROM verifications WHERE identifier = ? AND type = ?`, [identifier, type]);

        // Insert verifikasi baru
        await db.query(`
            INSERT INTO verifications (identifier, code, type, expires_at)
            VALUES (?, ?, ?, ?)
        `, [identifier, otp, type, expires_at]);

        // Kirim OTP
        try {
            if (method === 'email') {
                await kirimOtpEmail(user.email, otp, user.name, 'verifikasi akun');
            } else {
                await kirimOtpWa(user.phone, otp, user.name, 'verifikasi akun');
            }
        } catch (otpError) {
            console.error('Error kirim OTP:', otpError);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengirim OTP'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP berhasil dikirim ulang.'
        });
    } catch (err) {
        console.error('Error resend OTP:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal mengirim ulang OTP',
            error: err.message
        });
    }
};

// ========== LOGOUT ==========
export const logout = async(req, res) => {
    const { identifier } = req.body;
    if (!identifier) {
        return res.status(400).json({ success: false, message: 'Identifier wajib diisi' });
    }

    // Cek user berdasarkan email atau phone
    const [users] = await db.query(
        `SELECT * FROM users WHERE email = ? OR phone = ? OR username = ?`, [identifier, identifier, identifier]
    );
    if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const user = users[0];
    // Update status user menjadi 'inactive'
    await db.query(
        `UPDATE users SET status = 'inactive' WHERE id = ?`, [user.id]
    );
    res.json({ success: true, message: 'Logout berhasil' });
};

// ========== REGISTRASI GOOGLE ==========
export const registerWithGoogle = async(req, res) => {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'ID Token Google wajib.' });

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        const google_id = payload.sub;

        const [cek] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (cek.length > 0) {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }

        const otp = buatOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        const [hasil] = await db.query(`
            INSERT INTO users (name, email, google_id, role, status, method)
            VALUES (?, ?, ?, ?, ?, ?)`, [name, email, google_id, 'user', 'inactive', 'email']);

        const user_id = buatKodeUnik('user', null, hasil.insertId);
        await db.query(`UPDATE users SET user_id = ?, otp_code = ?, otp_expiry = ? WHERE user_id = ?`, [user_id, otp, expiry, hasil.insertId]);

        await kirimOtpEmail(email, otp);

        res.status(201).json({ success: true, user_id, message: 'Registrasi Google berhasil. OTP dikirim ke email.' });
    } catch (err) {
        console.error('Error Google Register:', err);
        res.status(500).json({ message: 'Gagal registrasi dengan Google', error: err.message });
    }
};

// ========== CEK STATUS WHATSAPP ==========
export const checkWhatsAppStatus = async(req, res) => {
    try {
        const { isReady } = await
        import ('../utils/wa.js');
        res.status(200).json({
            success: true,
            whatsapp_ready: isReady,
            message: isReady ? 'WhatsApp siap digunakan' : 'WhatsApp belum siap'
        });
    } catch (err) {
        console.error('Error cek status WhatsApp:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal cek status WhatsApp',
            error: err.message
        });
    }
};

// ========== KIRIM OTP MANUAL ==========
export const sendOtpManual = async(req, res) => {
    const { identifier, method } = req.body;
    if (!identifier || !method) {
        return res.status(400).json({
            success: false,
            message: 'Identifier dan method wajib diisi.'
        });
    }

    try {
        // Cek apakah user exists
        const kolom = method === 'email' ? 'email' : 'phone';
        const [userData] = await db.query(`SELECT * FROM users WHERE ${kolom} = ?`, [identifier]);

        if (userData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        const user = userData[0];

        // Generate OTP baru
        const otp = buatOTP();
        const type = method === 'email' ? 'email' : 'whatsapp';
        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

        // Hapus verifikasi lama
        await db.query(`DELETE FROM verifications WHERE identifier = ? AND type = ?`, [identifier, type]);

        // Insert verifikasi baru
        await db.query(`
            INSERT INTO verifications (identifier, code, type, expires_at)
            VALUES (?, ?, ?, ?)
        `, [identifier, otp, type, expires_at]);

        // Kirim OTP
        let otpSent = false;
        try {
            if (method === 'email') {
                await kirimOtpEmail(user.email, otp, user.name, 'verifikasi akun');
                otpSent = true;
            } else {
                const waResult = await kirimOtpWa(user.phone, otp, user.name, 'verifikasi akun');
                otpSent = waResult;
            }
        } catch (otpError) {
            console.error('Error kirim OTP:', otpError);
        }

        res.status(200).json({
            success: true,
            message: otpSent ?
                'OTP berhasil dikirim.' : 'OTP disimpan di database.',
            data: {
                identifier,
                method,
                otp_sent: otpSent,
                otp_code: otpSent ? null : otp, // Tampilkan OTP jika gagal dikirim
                expires_at
            }
        });
    } catch (err) {
        console.error('Error kirim OTP manual:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal mengirim OTP',
            error: err.message
        });
    }
};

// ========== CEK VERIFIKASI ==========
export const checkVerification = async(req, res) => {
    const { identifier, method } = req.query;
    if (!identifier || !method) {
        return res.status(400).json({
            success: false,
            message: 'Identifier dan method wajib diisi.'
        });
    }

    try {
        const type = method === 'email' ? 'email' : 'whatsapp';
        const [verificationData] = await db.query(`
            SELECT * FROM verifications 
            WHERE identifier = ? AND type = ?
            ORDER BY created_at DESC 
            LIMIT 1
        `, [identifier, type]);

        if (verificationData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Verifikasi tidak ditemukan.'
            });
        }

        const verification = verificationData[0];
        const isExpired = new Date(verification.expires_at) < new Date();

        res.status(200).json({
            success: true,
            data: {
                identifier,
                type,
                is_expired: isExpired,
                expires_at: verification.expires_at,
                created_at: verification.created_at
            }
        });
    } catch (err) {
        console.error('Error cek verifikasi:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal cek verifikasi',
            error: err.message
        });
    }
};

// ========== TEST EMAIL ==========
export const testEmail = async(req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email wajib diisi.'
        });
    }

    try {
        // Test koneksi SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Test email sederhana
        const testOtp = '123456';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #008c45;">Test Email SMTP</h2>
                <p>Ini adalah test email untuk memverifikasi konfigurasi SMTP Gmail.</p>
                <p>Kode test: <strong>${testOtp}</strong></p>
                <p>Jika email ini diterima, berarti konfigurasi SMTP sudah benar!</p>
            </div>
        `;

        const mailOptions = {
            from: `"BUMDesa Semplak Barat" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: '🧪 Test Email SMTP - BUMDesa Semplak Barat',
            html: html,
            text: 'Test email SMTP berhasil!'
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Test email berhasil dikirim',
            data: {
                messageId: info.messageId,
                email: email,
                smtp_config: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false
                }
            }
        });
    } catch (err) {
        console.error('Error test email:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal mengirim test email',
            error: err.message
        });
    }
};