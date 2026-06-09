import express from 'express';
import * as PackageEventController from '../controllers/PackageEventController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', PackageEventController.getAllPackages);
router.get('/category/:category', PackageEventController.getPackagesByCategory);
router.get('/:id', PackageEventController.getPackageById);
router.post('/', authMiddleware, requirePermission('create_package'), PackageEventController.createPackage);
router.put('/:id', authMiddleware, requirePermission('update_package'), PackageEventController.updatePackage);
router.delete('/:id', authMiddleware, requirePermission('delete_package'), PackageEventController.deletePackage);

export default router;