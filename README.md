# BUMDES Semplak Barat Backend

Backend API untuk aplikasi BUMDES Semplak Barat yang dibangun dengan Node.js dan Express.js.

## Fitur Utama

- **Authentication & Authorization**: Sistem login dan manajemen role
- **User Management**: Manajemen pengguna dan profil
- **Product Management**: Manajemen produk, kategori, dan review
- **Order Management**: Sistem pemesanan dan transaksi
- **Payment Integration**: Integrasi pembayaran
- **WhatsApp Integration**: Integrasi dengan WhatsApp API
- **Reporting**: Sistem pelaporan dan dashboard
- **Notification System**: Sistem notifikasi real-time

## Teknologi yang Digunakan

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL**: Database
- **JWT**: Authentication
- **Baileys**: WhatsApp API integration
- **Multer**: File upload handling
- **Nodemailer**: Email service

## Struktur Proyek

```
bumdes_semplakbarat/
├── config/          # Konfigurasi database dan aplikasi
├── controller/      # Controller untuk handling request
├── middleware/      # Middleware untuk validasi dan auth
├── models/          # Model database
├── routes/          # Route definitions
├── services/        # Business logic services
├── utils/           # Utility functions
├── database/        # SQL files dan backup database
└── docs/           # Dokumentasi
```

## Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd bumdes_semplakbarat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   - Import file SQL dari folder `database/`
   - Konfigurasi koneksi database di `config/database.js`

4. **Setup environment variables**
   - Buat file `.env` berdasarkan template yang ada
   - Isi dengan konfigurasi yang sesuai

5. **Run aplikasi**
   ```bash
   npm start
   # atau
   node server.js
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction

## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang BUMDES Semplak Barat.
