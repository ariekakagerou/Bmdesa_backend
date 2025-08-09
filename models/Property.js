import pool from '../config/db.js';

class Property {
    // CREATE
    static async create({ unit_id, name, description, location, price, size, image_url }) {
        const [result] = await pool.execute(
            `INSERT INTO Properties (unit_id, name, description, location, price, size, status, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [unit_id, name, description, location, price, size || null, 'available', image_url]
        );
        return result.insertId;
    }

    // GET ALL PROPERTIES
    static async getAll() {
        const [rows] = await pool.execute(
            `SELECT p.*, b.name as unit_name 
             FROM Properties p
             JOIN BusinessUnits b ON p.unit_id = b.unit_id
             ORDER BY p.created_at DESC`
        );
        return rows;
    }

    // GET BY UNIT ID
    static async getByUnit(unitId) {
        const [rows] = await pool.execute(
            `SELECT * FROM Properties 
             WHERE unit_id = ? 
             ORDER BY name`, [unitId]
        );
        return rows;
    }

    // GET BY PROPERTY ID
    static async getById(propertyId) {
        const [rows] = await pool.execute(
            `SELECT p.*, b.name as unit_name 
             FROM Properties p
             JOIN BusinessUnits b ON p.unit_id = b.unit_id
             WHERE p.property_id = ?`, [propertyId]
        );
        return rows[0];
    }

    // UPDATE PROPERTY
    static async update(propertyId, { name, description, location, price, size, status, image_url }) {
        await pool.execute(
            `UPDATE Properties 
             SET name = ?, description = ?, location = ?, price = ?, size = ?, status = ?, image_url = ? 
             WHERE property_id = ?`, [name, description, location, price, size || null, status, image_url, propertyId]
        );
    }

    // UPDATE STATUS SAJA
    static async updateStatus(propertyId, status) {
        await pool.execute(
            `UPDATE Properties 
             SET status = ? 
             WHERE property_id = ?`, [status, propertyId]
        );
    }

    // DELETE PROPERTY
    static async delete(propertyId) {
        await pool.execute(
            `DELETE FROM Properties 
             WHERE property_id = ?`, [propertyId]
        );
    }

    // GET HANYA YANG AVAILABLE
    static async getAvailableProperties() {
        const [rows] = await pool.execute(
            `SELECT p.*, b.name as unit_name 
             FROM Properties p
             JOIN BusinessUnits b ON p.unit_id = b.unit_id
             WHERE p.status = 'available'
             ORDER BY p.created_at DESC`
        );
        return rows;
    }
}

export default Property;