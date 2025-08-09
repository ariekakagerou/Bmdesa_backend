import mysql from 'mysql2/promise';

class Verification {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    // Membuat koneksi database
    async getConnection() {
        return await mysql.createConnection(this.dbConfig);
    }

    // Membuat data verifikasi baru
    async create(verificationData) {
        const connection = await this.getConnection();
        try {
            const { identifier, code, jenis, penyortiran, expires_at } = verificationData;
            
            const query = `
                INSERT INTO verification (identifier, code, jenis, penyortiran, expires_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            `;
            
            const [result] = await connection.execute(query, [
                identifier, 
                code, 
                jenis, 
                penyortiran, 
                expires_at
            ]);
            
            return {
                id: result.insertId,
                identifier,
                code,
                jenis,
                penyortiran,
                expires_at,
                created_at: new Date(),
                updated_at: new Date()
            };
        } finally {
            await connection.end();
        }
    }

    // Mencari verifikasi berdasarkan ID
    async findById(id) {
        const connection = await this.getConnection();
        try {
            const query = 'SELECT * FROM verification WHERE id = ?';
            const [rows] = await connection.execute(query, [id]);
            return rows[0] || null;
        } finally {
            await connection.end();
        }
    }

    // Mencari verifikasi berdasarkan identifier
    async findByIdentifier(identifier) {
        const connection = await this.getConnection();
        try {
            const query = 'SELECT * FROM verification WHERE identifier = ?';
            const [rows] = await connection.execute(query, [identifier]);
            return rows[0] || null;
        } finally {
            await connection.end();
        }
    }

    // Mencari verifikasi berdasarkan identifier dan code
    async findByIdentifierAndCode(identifier, code) {
        const connection = await this.getConnection();
        try {
            const query = 'SELECT * FROM verification WHERE identifier = ? AND code = ?';
            const [rows] = await connection.execute(query, [identifier, code]);
            return rows[0] || null;
        } finally {
            await connection.end();
        }
    }

    // Mendapatkan semua data verifikasi
    async findAll(limit = 100, offset = 0) {
        const connection = await this.getConnection();
        try {
            const query = 'SELECT * FROM verification ORDER BY created_at DESC LIMIT ? OFFSET ?';
            const [rows] = await connection.execute(query, [limit, offset]);
            return rows;
        } finally {
            await connection.end();
        }
    }

    // Update data verifikasi
    async update(id, updateData) {
        const connection = await this.getConnection();
        try {
            const fields = [];
            const values = [];
            
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(updateData[key]);
                }
            });
            
            if (fields.length === 0) {
                throw new Error('No fields to update');
            }
            
            fields.push('updated_at = NOW()');
            values.push(id);
            
            const query = `UPDATE verification SET ${fields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute(query, values);
            
            if (result.affectedRows === 0) {
                throw new Error('Verification not found');
            }
            
            return await this.findById(id);
        } finally {
            await connection.end();
        }
    }

    // Menghapus data verifikasi
    async delete(id) {
        const connection = await this.getConnection();
        try {
            const query = 'DELETE FROM verification WHERE id = ?';
            const [result] = await connection.execute(query, [id]);
            return result.affectedRows > 0;
        } finally {
            await connection.end();
        }
    }

    // Menghapus verifikasi yang sudah expired
    async deleteExpired() {
        const connection = await this.getConnection();
        try {
            const query = 'DELETE FROM verification WHERE expires_at < NOW()';
            const [result] = await connection.execute(query);
            return result.affectedRows;
        } finally {
            await connection.end();
        }
    }

    // Mengecek apakah kode sudah expired
    isExpired(verificationData) {
        if (!verificationData.expires_at) return false;
        return new Date(verificationData.expires_at) < new Date();
    }

    // Generate random verification code
    generateVerificationCode(length = 6) {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Set expiration time (default 15 minutes)
    setExpirationTime(minutes = 15) {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + minutes);
        return expirationTime;
    }
}

export default Verification;