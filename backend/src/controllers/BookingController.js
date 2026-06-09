import * as BookingService from '../services/BookingService.js';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await BookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingByCode = async (req, res) => {
  try {
    const booking = await BookingService.getBookingByCode(req.params.code);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking tidak ditemukan' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await BookingService.createBooking(req.body);
    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await BookingService.updateBooking(req.params.id, req.body);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking updated', data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await BookingService.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calculate = async (req, res) => {
  try {
    const { packageEventId, pax } = req.body;
    if (!packageEventId || !pax) {
      return res.status(400).json({ success: false, message: 'packageEventId and pax required' });
    }

    const db = (await import('../models/index.js')).default;
    const pkg = await db.PackageEvent.findByPk(packageEventId, {
      include: [
        {
          model: db.InventoryItem,
          through: { attributes: ['quantity'] }
        },
        {
          model: db.Service,
          through: { attributes: ['qtyPerPax'] }
        }
      ]
    });

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const revenue = BookingService.calculateRevenue(pkg, pax);
    res.json({ success: true, data: { package: pkg, ...revenue } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFinancialReport = async (req, res) => {
  try {
    const report = await BookingService.getFinancialReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentProof = async (req, res) => {
  try {
    const { paymentProof } = req.body;
    if (!paymentProof) {
      return res.status(400).json({ success: false, message: 'paymentProof required' });
    }
    const booking = await BookingService.updateBooking(req.params.id, { paymentProof });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Payment proof updated', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
