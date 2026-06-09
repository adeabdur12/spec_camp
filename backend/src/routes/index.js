import express from 'express';
import bookingRoutes from './bookingRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import packageEventRoutes from './packageEventRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import customerRoutes from './customerRoutes.js';
import uploadRoutes from './upload.js';
import reportRoutes from './reportRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/bookings', bookingRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/package-events', packageEventRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/services', serviceRoutes);
router.use('/customers', customerRoutes);
router.use('/upload', uploadRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;