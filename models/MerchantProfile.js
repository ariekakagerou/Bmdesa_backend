// models/MerchantProfile.js
import db from '../config/db.js'; // sesuaikan path jika berbeda

class MerchantProfile {
  constructor(data) {
    this.profile_id = data.profile_id;
    this.user_id = data.user_id;
    this.store_name = data.store_name;
    this.logo_url = data.logo_url;
    this.description = data.description;
    this.open_hour = data.open_hour;
    this.created_at = data.created_at;
  }

  static async findAll() {
    const query = `SELECT * FROM merchant_profiles ORDER BY created_at DESC`;
    const [rows] = await db.execute(query);
    return rows.map(row => new MerchantProfile(row));
  }

  static async findById(profileId) {
    const query = `SELECT * FROM merchant_profiles WHERE profile_id = ?`;
    const [rows] = await db.execute(query, [profileId]);
    return rows[0] ? new MerchantProfile(rows[0]) : null;
  }

  static async findByStoreName(storeName) {
    const query = `SELECT * FROM merchant_profiles WHERE store_name LIKE ? ORDER BY store_name ASC`;
    const [rows] = await db.execute(query, [`%${storeName}%`]);
    return rows.map(row => new MerchantProfile(row));
  }

  static async findByUserId(userId) {
    const query = `SELECT * FROM merchant_profiles WHERE user_id = ?`;
    const [rows] = await db.execute(query, [userId]);
    return rows[0] ? new MerchantProfile(rows[0]) : null;
  }

  static async create(data) {
    const query = `
      INSERT INTO merchant_profiles (user_id, store_name, logo_url, description, open_hour, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.user_id,
      data.store_name,
      data.logo_url,
      data.description,
      data.open_hour,
      data.created_at || new Date()
    ];
    const [result] = await db.execute(query, values);
    return await MerchantProfile.findById(result.insertId);
  }

  static async update(profileId, updateData) {
    const fields = [];
    const values = [];
    for (const key in updateData) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }
    if (fields.length === 0) throw new Error('No fields to update');
    values.push(profileId);

    const query = `UPDATE merchant_profiles SET ${fields.join(', ')} WHERE profile_id = ?`;
    await db.execute(query, values);
    return await MerchantProfile.findById(profileId);
  }

  static async delete(profileId) {
    const query = `DELETE FROM merchant_profiles WHERE profile_id = ?`;
    const [result] = await db.execute(query, [profileId]);
    if (result.affectedRows === 0) throw new Error('Merchant profile not found');
    return true;
  }

  static async exists(profileId) {
    const query = `SELECT COUNT(*) as count FROM merchant_profiles WHERE profile_id = ?`;
    const [rows] = await db.execute(query, [profileId]);
    return rows[0].count > 0;
  }
}

export default MerchantProfile;
