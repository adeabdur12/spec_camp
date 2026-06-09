import express from 'express';
import ServiceController from '../controllers/ServiceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const serviceController = new ServiceController();

router.get('/', serviceController.getAll);
router.get('/category/:category', serviceController.getByCategory);
router.get('/:id', serviceController.getById);
router.post('/', authMiddleware, serviceController.create);
router.put('/:id', authMiddleware, serviceController.update);
router.delete('/:id', authMiddleware, serviceController.delete);

export default router;
