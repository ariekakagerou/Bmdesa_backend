import pool from '../config/db.js';

const ShippingAddress = {
    getAll: () => pool.query('SELECT * FROM shipping_addresses'),

    getById: (id) => pool.query('SELECT * FROM shipping_addresses WHERE address_id = ?', [id]),

    create: (data) => {
        const {
            user_id,
            recipient_name,
            phone,
            address,
            city,
            district,
            subdistrict,
            province,
            post_code
        } = data;

        return pool.query(
            `INSERT INTO shipping_addresses 
                (user_id, recipient_name, phone, address, city, district, subdistrict, province, post_code) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, recipient_name, phone, address, city, district, subdistrict, province, post_code]
        );
    },

    update: (id, data) => {
        const {
            user_id,
            recipient_name,
            phone,
            address,
            city,
            district,
            subdistrict,
            province,
            post_code
        } = data;

        return pool.query(
            `UPDATE shipping_addresses 
             SET user_id = ?, recipient_name = ?, phone = ?, address = ?, city = ?, district = ?, subdistrict = ?, province = ?, post_code = ?
             WHERE address_id = ?`, [user_id, recipient_name, phone, address, city, district, subdistrict, province, post_code, id]
        );
    },

    delete: (id) => pool.query('DELETE FROM shipping_addresses WHERE address_id = ?', [id]),
};

export default ShippingAddress;