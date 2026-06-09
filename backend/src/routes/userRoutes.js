import express from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const router = express.Router();
const userController = new UserController();

router.use(authMiddleware);
router.use(requirePermission('manage_user'));

router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;