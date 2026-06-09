import sequelize from '../config/database.js';
import Booking from './Booking.js';
import User from './User.js';
import Role from './Role.js';
import Permission from './Permission.js';
import RolePermission from './RolePermission.js';
import PackageEvent from './PackageEvent.js';
import InventoryItem from './InventoryItem.js';
import PackageInventory from './PackageInventory.js';
import Service from './Service.js';
import PackageService from './PackageService.js';
import Customer from './Customer.js';
import BookingService from './BookingService.js';
import BookingInventory from './BookingInventory.js';

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });

Booking.belongsTo(PackageEvent, { foreignKey: 'packageEventId' });
PackageEvent.hasMany(Booking, { foreignKey: 'packageEventId' });

Booking.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Booking, { foreignKey: 'customerId' });

Booking.belongsToMany(Service, { 
  through: BookingService, 
  foreignKey: 'bookingId', 
  otherKey: 'serviceId',
  as: 'ExtraServices' 
});
Service.belongsToMany(Booking, { 
  through: BookingService, 
  foreignKey: 'serviceId', 
  otherKey: 'bookingId' 
});

Booking.belongsToMany(InventoryItem, {
  through: BookingInventory,
  foreignKey: 'bookingId',
  otherKey: 'inventoryItemId',
  as: 'InventoryItems'
});
InventoryItem.belongsToMany(Booking, {
  through: BookingInventory,
  foreignKey: 'inventoryItemId',
  otherKey: 'bookingId'
});

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  Booking,
  User,
  Role,
  Permission,
  RolePermission,
  PackageEvent,
  InventoryItem,
  PackageInventory,
  Service,
  PackageService,
  Customer,
  BookingService,
  BookingInventory
};

export default db;