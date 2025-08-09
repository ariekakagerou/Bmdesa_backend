// models/BusinessUnit.js
import db from '../config/db.js';

const BusinessUnit = {
    getAll: async() => {
        const [rows] = await db.promise().query('SELECT * FROM BusinessUnits');
        return rows;
    },

    create: async(name, description, manager_id) => {
        const [result] = await db.promise().query(
            'INSERT INTO BusinessUnits (name, description, manager_id) VALUES (?, ?, ?)', [name, description, manager_id]
        );
        return result.insertId;
    }
};

export default BusinessUnit;