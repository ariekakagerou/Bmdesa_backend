-- Menambahkan kolom OTP ke tabel users
ALTER TABLE users 
ADD COLUMN otp_code VARCHAR(10) NULL,
ADD COLUMN otp_expiry TIMESTAMP NULL;

-- Menambahkan index untuk optimasi query OTP
CREATE INDEX idx_users_otp_code ON users(otp_code);
CREATE INDEX idx_users_otp_expiry ON users(otp_expiry); 