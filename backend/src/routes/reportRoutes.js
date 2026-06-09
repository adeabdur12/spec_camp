import express from 'express';
import * as ReportController from '../controllers/ReportController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/financial', authMiddleware, requirePermission('view_booking'), ReportController.getFinancialReport);

export default router;
