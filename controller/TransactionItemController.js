import mysql from 'mysql2/promise';

// Konfigurasi database
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name'
};

class TransactionItemController {
  // GET - Mendapatkan semua transaction items
  static async getAllTransactionItems(req, res) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT * FROM transaction_items ORDER BY item_id ASC');
      await connection.end();
      
      res.status(200).json({
        success: true,
        data: rows,
        message: 'Transaction items retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching transaction items:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET - Mendapatkan transaction item berdasarkan ID
  static async getTransactionItemById(req, res) {
    try {
      const { id } = req.params;
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT * FROM transaction_items WHERE item_id = ?', [id]);
      await connection.end();
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Transaction item not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: rows[0],
        message: 'Transaction item retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching transaction item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET - Mendapatkan transaction items berdasarkan transaction_id
  static async getTransactionItemsByTransactionId(req, res) {
    try {
      const { transactionId } = req.params;
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT * FROM transaction_items WHERE transaction_id = ?', [transactionId]);
      await connection.end();
      
      res.status(200).json({
        success: true,
        data: rows,
        message: 'Transaction items retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching transaction items by transaction ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // POST - Membuat transaction item baru
  static async createTransactionItem(req, res) {
    try {
      const { transaction_id, reference_id, type, quantity, price } = req.body;
      
      // Validasi input
      if (!transaction_id || !reference_id || !type || !quantity || !price) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: transaction_id, reference_id, type, quantity, price'
        });
      }

      // Validasi tipe data
      if (typeof quantity !== 'number' || typeof price !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Quantity and price must be numbers'
        });
      }

      const connection = await mysql.createConnection(dbConfig);
      const [result] = await connection.execute(
        'INSERT INTO transaction_items (transaction_id, reference_id, type, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [transaction_id, reference_id, type, quantity, price]
      );
      await connection.end();
      
      res.status(201).json({
        success: true,
        data: {
          item_id: result.insertId,
          transaction_id,
          reference_id,
          type,
          quantity,
          price
        },
        message: 'Transaction item created successfully'
      });
    } catch (error) {
      console.error('Error creating transaction item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // PUT - Update transaction item
  static async updateTransactionItem(req, res) {
    try {
      const { id } = req.params;
      const { transaction_id, reference_id, type, quantity, price } = req.body;
      
      // Validasi input
      if (!transaction_id || !reference_id || !type || !quantity || !price) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: transaction_id, reference_id, type, quantity, price'
        });
      }

      // Validasi tipe data
      if (typeof quantity !== 'number' || typeof price !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Quantity and price must be numbers'
        });
      }

      const connection = await mysql.createConnection(dbConfig);
      
      // Cek apakah item exists
      const [existingItem] = await connection.execute('SELECT * FROM transaction_items WHERE item_id = ?', [id]);
      if (existingItem.length === 0) {
        await connection.end();
        return res.status(404).json({
          success: false,
          message: 'Transaction item not found'
        });
      }

      const [result] = await connection.execute(
        'UPDATE transaction_items SET transaction_id = ?, reference_id = ?, type = ?, quantity = ?, price = ? WHERE item_id = ?',
        [transaction_id, reference_id, type, quantity, price, id]
      );
      await connection.end();
      
      res.status(200).json({
        success: true,
        data: {
          item_id: parseInt(id),
          transaction_id,
          reference_id,
          type,
          quantity,
          price
        },
        message: 'Transaction item updated successfully'
      });
    } catch (error) {
      console.error('Error updating transaction item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // DELETE - Hapus transaction item
  static async deleteTransactionItem(req, res) {
    try {
      const { id } = req.params;
      const connection = await mysql.createConnection(dbConfig);
      
      // Cek apakah item exists
      const [existingItem] = await connection.execute('SELECT * FROM transaction_items WHERE item_id = ?', [id]);
      if (existingItem.length === 0) {
        await connection.end();
        return res.status(404).json({
          success: false,
          message: 'Transaction item not found'
        });
      }

      const [result] = await connection.execute('DELETE FROM transaction_items WHERE item_id = ?', [id]);
      await connection.end();
      
      res.status(200).json({
        success: true,
        message: 'Transaction item deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting transaction item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default TransactionItemController;