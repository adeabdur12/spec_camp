import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'unit'
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'inventory_items',
  timestamps: true
});

export default InventoryItem;
