import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BookingService = sequelize.define('BookingService', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  priceAtBooking: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'booking_services',
  timestamps: true
});

export default BookingService;
