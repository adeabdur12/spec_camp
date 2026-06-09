import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RolePermission = sequelize.define('RolePermission', {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  permissionId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'role_permissions',
  timestamps: true,
  indexes: [
    { fields: ['roleId'] },
    { fields: ['permissionId'] }
  ]
});

export default RolePermission;