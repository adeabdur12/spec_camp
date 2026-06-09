import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('walk_in', 'camping', 'event', 'tracking'),
    defaultValue: 'camping'
  },
  packageEventId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'package_events',
      key: 'id'
    }
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  pax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  // Revenue breakdown (snapshot at booking time)
  basePrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  inventoryCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  serviceCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  netRevenue: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  specCampShare: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  mimountShare: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  mimountTotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentProof: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bookingCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['status'] },
    { fields: ['type'] },
    { fields: ['checkInDate'] },
    { fields: ['checkOutDate'] }
  ]
});

export default Booking;
