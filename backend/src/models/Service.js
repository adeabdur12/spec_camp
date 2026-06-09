import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Service = sequelize.define('Service', {
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
    defaultValue: 'orang'
  },
  type: {
    type: DataTypes.ENUM('spec_camp', 'mimount', 'eksternal'),
    defaultValue: 'spec_camp'
  },
  category: {
    type: DataTypes.ENUM('guide', 'games', 'ticket', 'transport', 'documentation', 'other'),
    defaultValue: 'other'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isViewPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'services',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['isActive'] }
  ]
});

export default Service;
