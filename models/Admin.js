import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Konfigurasi database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'your_database_name'
};

class Admin {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async getAllAdmins() {
    try {
      if (!this.connection) await this.connect();
      const [rows] = await this.connection.execute('SELECT id, username FROM admin');
      return rows;
    } catch (error) {
      console.error('Error getting all admins:', error);
      throw error;
    }
  }

  async getAdminById(id) {
    try {
      if (!this.connection) await this.connect();
      const [rows] = await this.connection.execute('SELECT id, username FROM admin WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting admin by ID:', error);
      throw error;
    }
  }

  async getAdminByUsername(username) {
    try {
      if (!this.connection) await this.connect();
      const [rows] = await this.connection.execute('SELECT * FROM admin WHERE username = ?', [username]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting admin by username:', error);
      throw error;
    }
  }

  async createAdmin(username, password) {
    try {
      if (!this.connection) await this.connect();
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await this.connection.execute(
        'INSERT INTO admin (username, password) VALUES (?, ?)', 
        [username, hashedPassword]
      );
      return { id: result.insertId, username };
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async updateAdmin(id, username, password = null) {
    try {
      if (!this.connection) await this.connect();
      let query = 'UPDATE admin SET username = ?';
      const params = [username];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
      }

      query += ' WHERE id = ?';
      params.push(id);

      const [result] = await this.connection.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  async deleteAdmin(id) {
    try {
      if (!this.connection) await this.connect();
      const [result] = await this.connection.execute('DELETE FROM admin WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const admin = await this.getAdminByUsername(username);
      if (!admin) {
        return { success: false, message: 'Admin tidak ditemukan' };
      }

      const isPasswordValid = await this.verifyPassword(password, admin.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Password salah' };
      }

      return {
        success: true,
        data: {
          id: admin.id,
          username: admin.username
        }
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

export default Admin;
