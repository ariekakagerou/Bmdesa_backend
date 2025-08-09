import db from '../config/database.js';

class PasswordReset {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.token = data.token;
    this.code = data.code;
    this.expires_at = data.expires_at;
    this.created_at = data.created_at;
  }

  // Create new password reset request
  static async create(email, token, code, expiresAt) {
    try {
      const [result] = await db.execute(
        'INSERT INTO password_resets (email, token, code, expires_at) VALUES (?, ?, ?, ?)',
        [email, token, code, expiresAt]
      );
      
      return {
        id: result.insertId,
        email,
        token,
        code,
        expires_at: expiresAt
      };
    } catch (error) {
      throw new Error(`Failed to create password reset: ${error.message}`);
    }
  }

  // Find password reset by token
  static async findByToken(token) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      
      return rows.length > 0 ? new PasswordReset(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find password reset by token: ${error.message}`);
    }
  }

  // Find password reset by email and code
  static async findByEmailAndCode(email, code) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()',
        [email, code]
      );
      
      return rows.length > 0 ? new PasswordReset(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find password reset by email and code: ${error.message}`);
    }
  }

  // Find password reset by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM password_resets WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? new PasswordReset(rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find password reset by email: ${error.message}`);
    }
  }

  // Update existing password reset
  static async updateByEmail(email, token, code, expiresAt) {
    try {
      const [result] = await db.execute(
        'UPDATE password_resets SET token = ?, code = ?, expires_at = ?, created_at = NOW() WHERE email = ?',
        [token, code, expiresAt, email]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to update password reset: ${error.message}`);
    }
  }

  // Delete password reset by email
  static async deleteByEmail(email) {
    try {
      const [result] = await db.execute(
        'DELETE FROM password_resets WHERE email = ?',
        [email]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete password reset: ${error.message}`);
    }
  }

  // Delete password reset by token
  static async deleteByToken(token) {
    try {
      const [result] = await db.execute(
        'DELETE FROM password_resets WHERE token = ?',
        [token]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete password reset by token: ${error.message}`);
    }
  }

  // Get all password resets
  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT id, email, code, expires_at, created_at FROM password_resets ORDER BY created_at DESC'
      );
      
      return rows.map(row => new PasswordReset(row));
    } catch (error) {
      throw new Error(`Failed to get all password resets: ${error.message}`);
    }
  }

  // Clean expired password resets
  static async cleanExpired() {
    try {
      const [result] = await db.execute(
        'DELETE FROM password_resets WHERE expires_at < NOW()'
      );
      
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Failed to clean expired resets: ${error.message}`);
    }
  }

  // Check if token/code is expired
  static async isExpired(token = null, email = null, code = null) {
    try {
      let query, params;
      
      if (token) {
        query = 'SELECT expires_at FROM password_resets WHERE token = ?';
        params = [token];
      } else if (email && code) {
        query = 'SELECT expires_at FROM password_resets WHERE email = ? AND code = ?';
        params = [email, code];
      } else {
        throw new Error('Either token or email+code must be provided');
      }
      
      const [rows] = await db.execute(query, params);
      
      if (rows.length === 0) {
        return true; // Consider non-existent as expired
      }
      
      const expiresAt = new Date(rows[0].expires_at);
      const now = new Date();
      
      return now > expiresAt;
    } catch (error) {
      throw new Error(`Failed to check expiration: ${error.message}`);
    }
  }

  // Get count of active (non-expired) resets
  static async getActiveCount() {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM password_resets WHERE expires_at > NOW()'
      );
      
      return rows[0].count;
    } catch (error) {
      throw new Error(`Failed to get active count: ${error.message}`);
    }
  }

  // Get count of expired resets
  static async getExpiredCount() {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM password_resets WHERE expires_at <= NOW()'
      );
      
      return rows[0].count;
    } catch (error) {
      throw new Error(`Failed to get expired count: ${error.message}`);
    }
  }

  // Convert to JSON (for API responses)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      code: this.code,
      expires_at: this.expires_at,
      created_at: this.created_at,
      is_expired: new Date() > new Date(this.expires_at)
    };
  }
}

export default PasswordReset;