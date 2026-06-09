import db from '../models/index.js';
const { Booking, PackageEvent, Service, InventoryItem, User } = db;
import { Op } from 'sequelize';
import axios from 'axios';

const generateBookingCode = async () => {
  for (let i = 0; i < 10; i++) {
    const code = String(Math.floor(10000 + Math.random() * 90000));
    const exists = await Booking.findOne({ where: { bookingCode: code } });
    if (!exists) return code;
  }
  return String(Date.now()).slice(-5);
};

const includeOptions = [
  {
    model: PackageEvent
  },
  {
    model: Service,
    as: 'ExtraServices',
    through: { attributes: ['quantity', 'priceAtBooking'] }
  },
  {
    model: InventoryItem,
    as: 'InventoryItems',
    through: { attributes: ['quantity', 'priceAtBooking'] }
  }
];

const calculateRevenue = (pkg, pax, extraServices = [], inventoryItems = []) => {
  const inventoryCost = inventoryItems.reduce((sum, i) => sum + (Number(i.price) * (Number(i.quantity) || 1)), 0);

  const mimountServiceCost = extraServices
    .filter(s => s.type === 'mimount')
    .reduce((sum, s) => sum + (Number(s.price) * (Number(s.quantity) || 1)), 0);

  const eksternalServiceCost = extraServices
    .filter(s => s.type === 'eksternal')
    .reduce((sum, s) => sum + (Number(s.price) * (Number(s.quantity) || 1)), 0);

  const specCampServiceCost = extraServices
    .filter(s => s.type === 'spec_camp')
    .reduce((sum, s) => sum + (Number(s.price) * (Number(s.quantity) || 1)), 0);

  const extraServicesPrice = mimountServiceCost + eksternalServiceCost + specCampServiceCost;

  if (!pkg) {
    const totalPrice = extraServicesPrice + inventoryCost;
    const mimountTotal = inventoryCost + mimountServiceCost;
    return {
      basePrice: 0,
      inventoryCost,
      serviceCost: extraServicesPrice,
      netRevenue: totalPrice - eksternalServiceCost,
      specCampShare: Math.max(0, totalPrice - mimountTotal - eksternalServiceCost),
      mimountShare: 0,
      mimountTotal,
      totalPrice
    };
  }

  const basePrice = Number(pkg.pricePerPax) * pax;
  const totalPrice = basePrice + extraServicesPrice + inventoryCost;
  const pkgMimountShare = Number(pkg.mimountShare || 0) * pax;
  const mimountTotal = pkgMimountShare + inventoryCost + mimountServiceCost;
  const specCampShare = Math.max(0, totalPrice - mimountTotal - eksternalServiceCost);

  return {
    basePrice,
    inventoryCost,
    serviceCost: extraServicesPrice,
    netRevenue: totalPrice - eksternalServiceCost,
    specCampShare,
    mimountShare: pkgMimountShare,
    mimountTotal,
    totalPrice
  };
};

export const getAllBookings = async () => {
  return await Booking.findAll({
    include: includeOptions,
    order: [['createdAt', 'DESC']]
  });
};

export const getBookingByCode = async (code) => {
  return await Booking.findOne({
    where: { bookingCode: code },
    include: includeOptions
  });
};

export const getBookingById = async (id) => {
  return await Booking.findByPk(id, {
    include: includeOptions
  });
};

export const createBooking = async (data) => {
  const { extraServices, inventoryItems, ...bookingData } = data;
  let revenue = {};

  let detailedExtraServices = [];
  if (extraServices && extraServices.length > 0) {
    detailedExtraServices = await Promise.all(extraServices.map(async s => {
      const service = await Service.findByPk(s.id);
      return { ...service.toJSON(), quantity: s.quantity };
    }));
  }

  let detailedInventoryItems = [];
  if (inventoryItems && inventoryItems.length > 0) {
    detailedInventoryItems = await Promise.all(inventoryItems.map(async i => {
      const item = await InventoryItem.findByPk(i.id);
      return { ...item.toJSON(), quantity: i.quantity };
    }));
  }

  if (bookingData.packageEventId) {
    const pkg = await PackageEvent.findByPk(bookingData.packageEventId);

    if (!pkg) {
      throw new Error('Package not found');
    }

    revenue = calculateRevenue(pkg, bookingData.pax || 1, detailedExtraServices, detailedInventoryItems);
  } else {
    revenue = calculateRevenue(null, bookingData.pax || 1, detailedExtraServices, detailedInventoryItems);
    if (bookingData.totalPrice) revenue.totalPrice = bookingData.totalPrice;
  }

  const bookingCode = await generateBookingCode();

  const booking = await Booking.create({
    type: bookingData.type || 'camping',
    packageEventId: bookingData.packageEventId || null,
    customerName: bookingData.customerName,
    email: bookingData.email,
    phone: bookingData.phone,
    customerId: bookingData.customerId || null,
    checkInDate: bookingData.checkInDate,
    checkOutDate: bookingData.checkOutDate,
    pax: bookingData.pax || 1,
    basePrice: revenue.basePrice || 0,
    inventoryCost: revenue.inventoryCost || 0,
    serviceCost: revenue.serviceCost || 0,
    netRevenue: revenue.netRevenue || 0,
    specCampShare: revenue.specCampShare || 0,
    mimountShare: revenue.mimountShare || 0,
    mimountTotal: revenue.mimountTotal || 0,
    totalPrice: revenue.totalPrice,
    bookingCode,
    status: bookingData.status || 'pending',
    notes: bookingData.notes || ''
  });

  if (detailedExtraServices.length > 0) {
    const items = detailedExtraServices.map(s => ({
      bookingId: booking.id,
      serviceId: s.id,
      quantity: s.quantity,
      priceAtBooking: s.price
    }));
    await db.BookingService.bulkCreate(items);
  }

  if (detailedInventoryItems.length > 0) {
    const items = detailedInventoryItems.map(i => ({
      bookingId: booking.id,
      inventoryItemId: i.id,
      quantity: i.quantity,
      priceAtBooking: i.price
    }));
    await db.BookingInventory.bulkCreate(items);
  }

  const result = await getBookingById(booking.id);
  sendWaNotification(result);
  return result;
};

// Fire-and-forget WhatsApp notification
const sendWaNotification = async (booking) => {
  try {
    const users = await User.findAll({ where: { notifWa: true } });
    if (!users.length) return;
    
    const msg = `🔔 *Reservasi Baru Spec Camp*
━━━━━━━━━━━━━━━━━━━
👤 Nama: ${booking.customerName}
📦 Paket: ${booking.PackageEvent?.name || '-'}
📅 Tanggal: ${booking.checkInDate}
👥 Pax: ${booking.pax} orang
💰 Total: Rp ${Number(booking.totalPrice).toLocaleString('id-ID')}
🔑 Kode: #${booking.bookingCode}
━━━━━━━━━━━━━━━━━━━
Klik untuk detail: https://speccamp.site/search-booking?code=${booking.bookingCode}`;

    const target = users
      .filter(u => u.phone)
      .map(u => ({ number: u.phone, message: msg }));

    if (!target.length) return;

    console.log('Sending WA to', target.length, 'users');
    const res = await axios.post('http://100.93.25.40:3000/send_message', 
      { target },
      { headers: { 'Authorization': 'wiku_admin_devices', 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    console.log('WA sent:', res.data?.success);

    // Send confirmation to the customer
    if (booking.phone) {
      const customerMsg = `✅ *Booking Diterima!*
━━━━━━━━━━━━━━━━━━━
Halo ${booking.customerName},
Pemesanan kamu di *Spec Camp* sudah tercatat.

🔑 Kode Booking: *${booking.bookingCode}*
📅 Tanggal: ${booking.checkInDate} s/d ${booking.checkOutDate}
👥 ${booking.pax} orang
💰 Total: Rp ${Number(booking.totalPrice).toLocaleString('id-ID')}

📌 Silakan transfer ke:
Bank Mandiri
157-00-3199999-9
a.n. PT Bumimakmur Jaya Sentosa

Upload bukti bayar di:
https://speccamp.site/search-booking?code=${booking.bookingCode}

Terima kasih! 🏕️`;

      await axios.post('http://100.93.25.40:3000/send_message', 
        { target: [{ number: booking.phone, message: customerMsg }] },
        { headers: { 'Authorization': 'wiku_admin_devices', 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      console.log('Customer WA sent');
    }
  } catch (e) {
    console.error('WA notif failed:', e.message);
  }
};

export const updateBooking = async (id, data) => {
  const booking = await Booking.findByPk(id, { include: ['ExtraServices', 'InventoryItems'] });
  if (!booking) return null;

  const { extraServices, inventoryItems, ...bookingData } = data;
  const updateData = { ...bookingData };
  if (!bookingData.customerId) updateData.customerId = null;

  let detailedExtraServices = [];
  if (extraServices) {
    detailedExtraServices = await Promise.all(extraServices.map(async s => {
      const service = await Service.findByPk(s.id);
      return { ...service.toJSON(), quantity: s.quantity };
    }));
  } else {
    detailedExtraServices = booking.ExtraServices.map(s => ({
      ...s.toJSON(),
      quantity: s.BookingService?.quantity,
      price: s.BookingService?.priceAtBooking
    }));
  }

  let detailedInventoryItems = [];
  if (inventoryItems) {
    detailedInventoryItems = await Promise.all(inventoryItems.map(async i => {
      const item = await InventoryItem.findByPk(i.id);
      return { ...item.toJSON(), quantity: i.quantity };
    }));
  } else {
    detailedInventoryItems = booking.InventoryItems.map(i => ({
      ...i.toJSON(),
      quantity: i.BookingInventory?.quantity,
      price: i.BookingInventory?.priceAtBooking
    }));
  }

  if (bookingData.packageEventId && (bookingData.pax || booking.pax)) {
    const pkg = await PackageEvent.findByPk(bookingData.packageEventId);

    if (pkg) {
      const revenue = calculateRevenue(pkg, bookingData.pax || booking.pax, detailedExtraServices, detailedInventoryItems);
      Object.assign(updateData, revenue);
    }
  }

  await booking.update(updateData);

  if (extraServices) {
    await db.BookingService.destroy({ where: { bookingId: id } });
    if (detailedExtraServices.length > 0) {
      const items = detailedExtraServices.map(s => ({
        bookingId: id,
        serviceId: s.id,
        quantity: s.quantity,
        priceAtBooking: s.price
      }));
      await db.BookingService.bulkCreate(items);
    }
  }

  if (inventoryItems) {
    await db.BookingInventory.destroy({ where: { bookingId: id } });
    if (detailedInventoryItems.length > 0) {
      const items = detailedInventoryItems.map(i => ({
        bookingId: id,
        inventoryItemId: i.id,
        quantity: i.quantity,
        priceAtBooking: i.price
      }));
      await db.BookingInventory.bulkCreate(items);
    }
  }

  return await getBookingById(id);
};

export const deleteBooking = async (id) => {
  const booking = await Booking.findByPk(id);
  if (!booking) return false;
  await booking.destroy();
  return true;
};

export const getFinancialReport = async () => {
  const bookings = await Booking.findAll({
    where: { status: ['confirmed', 'completed'] }
  });

  const report = bookings.reduce((acc, b) => {
    acc.totalRevenue += Number(b.totalPrice || 0);
    acc.totalNetRevenue += Number(b.netRevenue || 0);
    acc.totalSpecCampShare += Number(b.specCampShare || 0);
    acc.totalMimountShare += Number(b.mimountShare || 0);
    acc.totalMimountTotal += Number(b.mimountTotal || 0);
    acc.totalInventoryCost += Number(b.inventoryCost || 0);
    acc.totalServiceCost += Number(b.serviceCost || 0);
    return acc;
  }, {
    totalRevenue: 0,
    totalNetRevenue: 0,
    totalSpecCampShare: 0,
    totalMimountShare: 0,
    totalMimountTotal: 0,
    totalInventoryCost: 0,
    totalServiceCost: 0
  });

  return report;
};

export { calculateRevenue };
