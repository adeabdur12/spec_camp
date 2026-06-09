import express from 'express';
import PermissionController from '../controllers/PermissionController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const router = express.Router();
const permissionController = new PermissionController();

router.use(authMiddleware);
router.use(requirePermission('manage_user'));

router.get('/', permissionController.getAll);

export default router;