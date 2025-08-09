import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10); // Membuat salt
    const hashed = await bcrypt.hash(password, salt); // Menghash password
    return hashed;
};

// Verifikasi password
export const comparePassword = async(password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword); // Membandingkan password yang diberikan dengan yang sudah di-hash
};