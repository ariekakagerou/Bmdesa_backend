import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'db_bumdes_semplak_barat',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test connection
sequelize.authenticate()
    .then(() => {
        console.log('✅ Berhasil terhubung ke database MySQL dengan Sequelize.');
    })
    .catch(err => {
        console.error('❌ Gagal terhubung ke database MySQL dengan Sequelize.', err);
        process.exit(1);
    });

export default sequelize; 