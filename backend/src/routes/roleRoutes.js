import express from 'express';
import RoleController from '../controllers/RoleController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const router = express.Router();
const roleController = new RoleController();

router.use(authMiddleware);
router.use(requirePermission('manage_user'));

router.get('/', roleController.getAll);
router.get('/permissions', roleController.getPermissions);
router.get('/role-permissions', roleController.getRolePermissions);
router.post('/', roleController.create);
router.put('/:id', roleController.update);
router.delete('/:id', roleController.delete);
router.put('/:id/permissions', roleController.updatePermissions);

export default router;