import moment from 'moment';
import Transaction from '../models/Transaction.js';

const allowedBanks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Danamon', 'Permata'];
const allowedEwallets = ['DANA', 'OVO', 'GoPay', 'ShopeePay', 'LinkAja'];

// ✅ Get semua transaksi
export const getAllTransactions = async(req, res) => {
    try {
        const transactions = await Transaction.getRecent(50);
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ✅ Buat transaksi baru + kirim link WhatsApp
export const createTransaction = async(req, res) => {
    try {
        const {
            user_id = null,
                type = null,
                items = [],
                total_price = null,
                status = 'pending',
                payment_method = null,
                payment_proof = null,
                notes = null,
                bank_name = null,
                bank_account_number = null,
                transfer_deadline = null,
                e_wallet_name = null,
                e_wallet_number = null,
                customer_name = null,
                shipping_address = null,
        } = req.body;

        // Validasi data dasar
        if (!user_id || !type || !Array.isArray(items) || items.length === 0 || total_price === null || !payment_method) {
            return res.status(400).json({ message: 'Data transaksi tidak lengkap atau tidak valid' });
        }

        // Validasi metode pembayaran
        if (payment_method === 'bank_transfer') {
            if (!bank_name || !bank_account_number || !transfer_deadline) {
                return res.status(400).json({ message: 'Data bank transfer tidak lengkap' });
            }
            if (!allowedBanks.includes(bank_name)) {
                return res.status(400).json({ message: 'Bank tidak didukung' });
            }
        }

        if (payment_method === 'e_wallet') {
            if (!e_wallet_name || !e_wallet_number) {
                return res.status(400).json({ message: 'Data e-wallet tidak lengkap' });
            }
            if (!allowedEwallets.includes(e_wallet_name)) {
                return res.status(400).json({ message: 'E-Wallet tidak didukung' });
            }
        }

        const data = {
            user_id,
            type,
            items,
            total_price,
            status,
            payment_method,
            payment_proof,
            notes,
            bank_name,
            bank_account_number,
            transfer_deadline,
            e_wallet_name,
            e_wallet_number,
            customer_name,
            shipping_address
        };

        // Simpan transaksi
        const transactionId = await Transaction.create(data);
        const createdTransaction = await Transaction.getById(transactionId);

        // Format daftar pesanan
        const daftarPesanan = items.map((item, i) =>
            `${i + 1}. ${item.nama || 'Produk'} - ${item.jumlah} pcs`
        ).join('\n');

        // Susun pesan WhatsApp
        const pesanWA =
            `Halo, ada pesanan baru:\n\n${daftarPesanan}\n\nTotal: Rp${total_price.toLocaleString()}\nNama: ${customer_name || 'Pelanggan'}\nAlamat: ${shipping_address || 'Belum diisi'}`;

        const nomorWA = '6281234567890'; // Ganti dengan nomor admin
        const waUrl = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWA)}`;

        res.status(201).json({
            message: 'Transaksi berhasil dibuat',
            data: createdTransaction,
            waUrl
        });
    } catch (err) {
        res.status(400).json({ message: 'Gagal membuat transaksi', error: err.message });
    }
};

// ✅ Get transaksi berdasarkan ID
export const getTransactionById = async(req, res) => {
    try {
        const transaction = await Transaction.getById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ✅ Update status transaksi
export const updateTransaction = async(req, res) => {
    const { status = null, payment_proof = null } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status tidak boleh kosong' });
    }

    try {
        await Transaction.updateStatus(req.params.id, status, payment_proof);
        res.json({ message: 'Status transaksi diperbarui' });
    } catch (err) {
        res.status(400).json({ message: 'Gagal memperbarui transaksi', error: err.message });
    }
};

// 🚫 Hapus transaksi (belum implementasi)
export const deleteTransaction = async(req, res) => {
    res.status(501).json({ message: 'Fungsi hapus transaksi belum diimplementasikan' });
};