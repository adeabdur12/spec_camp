import db from '../models/index.js';
const { Booking, Customer, InventoryItem, PackageEvent } = db;
import { Op } from 'sequelize';

export const getDashboardStats = async () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Total Revenue This Month
  const bookingsMonth = await Booking.findAll({
    where: {
      status: { [Op.in]: ['confirmed', 'completed'] },
      createdAt: { [Op.gte]: firstDayOfMonth }
    }
  });
  const revenueMonth = bookingsMonth.reduce((sum, b) => sum + Number(b.totalPrice), 0);

  // 2. Total Active Bookings
  const activeBookings = await Booking.count({
    where: { status: 'confirmed' }
  });

  // 3. Total Customers
  const totalCustomers = await Customer.count();

  // 4. Low Stock Items (less than 5)
  const lowStockItems = await InventoryItem.findAll({
    where: {
      stock: { [Op.lt]: 5 }
    },
    limit: 5
  });

  // 5. Recent Bookings
  const recentBookings = await Booking.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [{ model: PackageEvent, attributes: ['name'] }]
  });

  // 6. Check-ins Today
  const todayStart = new Date(now.setHours(0,0,0,0));
  const todayEnd = new Date(now.setHours(23,59,59,999));
  const checkinsToday = await Booking.findAll({
    where: {
      checkInDate: {
        [Op.between]: [todayStart, todayEnd]
      },
      status: 'confirmed'
    },
    include: [{ model: PackageEvent, attributes: ['name'] }]
  });

  // 7. Package Category Distribution (Confirmed/Completed)
  const allConfirmed = await Booking.findAll({
    where: { status: { [Op.in]: ['confirmed', 'completed'] } },
    include: [{ model: PackageEvent, attributes: ['category'] }]
  });

  const packageDist = allConfirmed.reduce((acc, b) => {
    const cat = b.PackageEvent?.category || 'manual';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return {
    revenueMonth,
    activeBookings,
    totalCustomers,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    recentBookings,
    checkinsToday,
    packageDist
  };
};
