import mysql from 'mysql2/promise';

// Konfigurasi database
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name'
};

class TransactionItem {
  constructor(item_id, transaction_id, reference_id, type, quantity, price) {
    this.item_id = item_id;
    this.transaction_id = transaction_id;
    this.reference_id = reference_id;
    this.type = type;
    this.quantity = quantity;
    this.price = price;
  }

  // Method untuk membuat koneksi database
  static async getConnection() {
    return await mysql.createConnection(dbConfig);
  }

  // Method untuk mendapatkan semua transaction items
  static async findAll() {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM transaction_items ORDER BY item_id ASC');
      return rows.map(row => new TransactionItem(
        row.item_id,
        row.transaction_id,
        row.reference_id,
        row.type,
        row.quantity,
        row.price
      ));
    } finally {
      await connection.end();
    }
  }

  // Method untuk mendapatkan transaction item berdasarkan ID
  static async findById(id) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM transaction_items WHERE item_id = ?', [id]);
      if (rows.length === 0) return null;
      
      const row = rows[0];
      return new TransactionItem(
        row.item_id,
        row.transaction_id,
        row.reference_id,
        row.type,
        row.quantity,
        row.price
      );
    } finally {
      await connection.end();
    }
  }

  // Method untuk mendapatkan transaction items berdasarkan transaction_id
  static async findByTransactionId(transactionId) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM transaction_items WHERE transaction_id = ?', [transactionId]);
      return rows.map(row => new TransactionItem(
        row.item_id,
        row.transaction_id,
        row.reference_id,
        row.type,
        row.quantity,
        row.price
      ));
    } finally {
      await connection.end();
    }
  }

  // Method untuk membuat transaction item baru
  static async create(transactionItemData) {
    const { transaction_id, reference_id, type, quantity, price } = transactionItemData;
    const connection = await this.getConnection();
    
    try {
      const [result] = await connection.execute(
        'INSERT INTO transaction_items (transaction_id, reference_id, type, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [transaction_id, reference_id, type, quantity, price]
      );
      
      return new TransactionItem(
        result.insertId,
        transaction_id,
        reference_id,
        type,
        quantity,
        price
      );
    } finally {
      await connection.end();
    }
  }

  // Method untuk update transaction item
  async update(updateData) {
    const { transaction_id, reference_id, type, quantity, price } = updateData;
    const connection = await TransactionItem.getConnection();
    
    try {
      await connection.execute(
        'UPDATE transaction_items SET transaction_id = ?, reference_id = ?, type = ?, quantity = ?, price = ? WHERE item_id = ?',
        [transaction_id, reference_id, type, quantity, price, this.item_id]
      );
      
      // Update instance properties
      this.transaction_id = transaction_id;
      this.reference_id = reference_id;
      this.type = type;
      this.quantity = quantity;
      this.price = price;
      
      return this;
    } finally {
      await connection.end();
    }
  }

  // Method untuk hapus transaction item
  async delete() {
    const connection = await TransactionItem.getConnection();
    try {
      await connection.execute('DELETE FROM transaction_items WHERE item_id = ?', [this.item_id]);
      return true;
    } finally {
      await connection.end();
    }
  }

  // Method untuk validasi data
  static validate(data) {
    const errors = [];
    
    if (!data.transaction_id) {
      errors.push('transaction_id is required');
    }
    
    if (!data.reference_id) {
      errors.push('reference_id is required');
    }
    
    if (!data.type) {
      errors.push('type is required');
    }
    
    if (!data.quantity || typeof data.quantity !== 'number') {
      errors.push('quantity is required and must be a number');
    }
    
    if (!data.price || typeof data.price !== 'number') {
      errors.push('price is required and must be a number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Method untuk mendapatkan total harga (quantity * price)
  getTotalPrice() {
    return this.quantity * this.price;
  }

  // Method untuk konversi ke JSON
  toJSON() {
    return {
      item_id: this.item_id,
      transaction_id: this.transaction_id,
      reference_id: this.reference_id,
      type: this.type,
      quantity: this.quantity,
      price: this.price,
      total_price: this.getTotalPrice()
    };
  }
}

export default TransactionItem;