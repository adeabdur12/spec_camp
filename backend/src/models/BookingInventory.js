import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BookingInventory = sequelize.define('BookingInventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'bookings', key: 'id' }
  },
  inventoryItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'inventory_items', key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  priceAtBooking: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'booking_inventories',
  timestamps: true
});

export default BookingInventory;
