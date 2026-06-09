import db from '../models/index.js';
const { Booking, PackageEvent } = db;
import { Op } from 'sequelize';

export const getFinancialStats = async (startDate, endDate) => {
  const where = {};
  if (startDate && endDate) {
    where.checkInDate = {
      [Op.between]: [startDate, endDate]
    };
  }

  const bookings = await Booking.findAll({
    where,
    include: [{ model: PackageEvent, attributes: ['name', 'category'] }]
  });

  const stats = {
    totalRevenue: 0,
    totalSpecCampShare: 0,
    totalMimountShare: 0,
    totalInventoryCost: 0,
    totalMimountTotal: 0,
    totalServiceCost: 0,
    count: bookings.length,
    byCategory: {},
    daily: {}
  };

  bookings.forEach(b => {
    const revenue = Number(b.totalPrice);
    const specShare = Number(b.specCampShare);
    const mimShare = Number(b.mimountShare);
    const invCost = Number(b.inventoryCost);
    const mimTotal = Number(b.mimountTotal);
    const svcCost = Number(b.serviceCost);

    stats.totalRevenue += revenue;
    stats.totalSpecCampShare += specShare;
    stats.totalMimountShare += mimShare;
    stats.totalInventoryCost += invCost;
    stats.totalMimountTotal += mimTotal;
    stats.totalServiceCost += svcCost;

    // By Category
    const cat = b.PackageEvent?.category || 'manual';
    if (!stats.byCategory[cat]) {
      stats.byCategory[cat] = { revenue: 0, count: 0 };
    }
    stats.byCategory[cat].revenue += revenue;
    stats.byCategory[cat].count += 1;

    // Daily
    const dateKey = typeof b.checkInDate === 'string' 
      ? b.checkInDate 
      : new Date(b.checkInDate).toISOString().split('T')[0];

    if (!stats.daily[dateKey]) {
      stats.daily[dateKey] = { revenue: 0, specCamp: 0, mimount: 0 };
    }
    stats.daily[dateKey].revenue += revenue;
    stats.daily[dateKey].specCamp += specShare;
    stats.daily[dateKey].mimount += mimTotal;
  });

  return stats;
};
