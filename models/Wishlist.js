import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Wishlist = db.define('Wishlist', {
  wishlist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'wishlist',
  timestamps: false
});

export default Wishlist;
