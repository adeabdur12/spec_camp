import express from 'express';
import * as DashboardController from '../controllers/DashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authMiddleware, DashboardController.getStats);

export default router;
