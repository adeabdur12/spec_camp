import express from 'express';
import * as BookingController from '../controllers/BookingController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, BookingController.getAllBookings);
router.get('/report/financial', authMiddleware, BookingController.getFinancialReport);
router.get('/code/:code', BookingController.getBookingByCode);
router.get('/:id', authMiddleware, BookingController.getBookingById);
router.post('/', BookingController.createBooking);
router.post('/calculate', BookingController.calculate);
router.patch('/:id/payment', BookingController.updatePaymentProof);
router.put('/:id', authMiddleware, requirePermission('update_booking'), BookingController.updateBooking);
router.delete('/:id', authMiddleware, requirePermission('delete_booking'), BookingController.deleteBooking);

export default router;
