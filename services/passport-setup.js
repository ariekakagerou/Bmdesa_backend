import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../config/db.js';

// Fungsi pembuat user_id unik
const buatKodeUnik = (role, tahun = null, nomor) => {
    const prefix = {
        user: 'USR',
        merchant: 'MCH',
        supplier: 'SPL',
        admin: 'ADM',
        super: 'SUP',
        sdm: 'SDM',
        tech: 'TEC',
        ketua: 'KET',
        sekretaris: 'SEC',
        bendahara: 'BEN',
        koordinator: 'KOR',
        staff: 'STF',
        hr: 'HRD',
        pengawas: 'PGW',
        manager: 'MGR',
        pemasaran: 'MKT',
        keuangan: 'KEU',
        hukum: 'HKM',
        it: 'IT',
        operator: 'OPR',
        pembina: 'PBN'
    };

    const kode = prefix[role] || 'UNK';
    const thn = (tahun || new Date().getFullYear()).toString().slice(-2);
    const no = nomor.toString().padStart(5, '0');
    return `${kode}${thn}${no}`;
};

// Daftarkan Google Strategy ke Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    scope: ['profile', 'email']
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const google_id = profile.id;

        // Cek apakah user sudah ada
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return done(null, rows[0]);
        } else {
            const newUser = {
                name: profile.displayName,
                email,
                google_id,
                role: 'user',
                method: 'google',
                status: 'inactive'
            };

            // Masukkan user baru
            const [result] = await db.query(
                'INSERT INTO users (name, email, google_id, role, method, status) VALUES (?, ?, ?, ?, ?, ?)', [newUser.name, newUser.email, newUser.google_id, newUser.role, newUser.method, newUser.status]
            );

            // Buat kode unik user_id
            const kodeUnik = buatKodeUnik(newUser.role, null, result.insertId);
            await db.query('UPDATE users SET user_id = ? WHERE id = ?', [kodeUnik, result.insertId]);

            newUser.user_id = kodeUnik;

            return done(null, newUser);
        }
    } catch (err) {
        return done(err, null);
    }
}));

// Serialisasi: simpan seluruh data user ke session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialisasi: kembalikan user dari session
passport.deserializeUser((user, done) => {
    done(null, user);
});