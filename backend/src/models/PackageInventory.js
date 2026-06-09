import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PackageInventory = sequelize.define('PackageInventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  packageEventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'package_events',
      key: 'id'
    }
  },
  inventoryItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'inventory_items',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'package_inventories',
  timestamps: true
});

export default PackageInventory;
