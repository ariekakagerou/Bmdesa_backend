# Setup Gmail SMTP untuk OTP Email

## Langkah-langkah Setup Gmail SMTP

### 1. Aktifkan 2-Factor Authentication
1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Pilih "Security"
3. Aktifkan "2-Step Verification"

### 2. Buat App Password
1. Setelah 2FA aktif, kembali ke "Security"
2. Pilih "App passwords"
3. Pilih "Mail" dan "Other (Custom name)"
4. Beri nama: "BUMDes App"
5. Klik "Generate"
6. **Copy App Password** (16 karakter)

### 3. Setup Environment Variables
Buat file `.env` di root project:

```env
# Email Configuration
EMAIL_USERNAME=your_email@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

### 4. Contoh Penggunaan

#### Register dengan Email:
```json
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Budi Santoso",
  "username": "budi123",
  "email": "budi@example.com",
  "password": "password123"
}
```

#### Kirim OTP Manual:
```json
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "identifier": "budi@example.com",
  "method": "email"
}
```

### 5. Troubleshooting

#### Error: "Invalid login"
- Pastikan App Password benar (16 karakter)
- Pastikan 2FA sudah aktif
- Jangan gunakan password Gmail biasa

#### Error: "Authentication failed"
- Cek EMAIL_USERNAME dan EMAIL_APP_PASSWORD
- Restart server setelah update .env

#### Error: "Connection timeout"
- Cek koneksi internet
- Pastikan port 587 tidak diblokir firewall

### 6. Test Email

Setelah setup, test dengan:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","method":"email"}'
```

### 7. Keamanan

- **Jangan commit** file `.env` ke git
- **Gunakan App Password**, bukan password Gmail
- **Aktifkan 2FA** untuk keamanan ekstra
- **Monitor** penggunaan email di Google Account 