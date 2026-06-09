import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PackageEvent = sequelize.define('PackageEvent', {
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
  category: {
    type: DataTypes.ENUM('community', 'area', 'ticket', 'tracking'),
    allowNull: false,
    defaultValue: 'area'
  },
  pricePerPax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  mimountShare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  minPax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  maxPax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  areaType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dayType: {
    type: DataTypes.ENUM('weekday', 'weekend'),
    allowNull: true
  },
  packageType: {
    type: DataTypes.ENUM('ekonomi', 'full'),
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  badgeText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  perPerson: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'package_events',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['isActive'] },
    { fields: ['isFeatured'] },
    { fields: ['packageType'] }
  ]
});

export default PackageEvent;