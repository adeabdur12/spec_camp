import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PackageService = sequelize.define('PackageService', {
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
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  qtyPerPax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'package_services',
  timestamps: true
});

export default PackageService;
