import express from 'express';
import * as CustomerController from '../controllers/CustomerController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, CustomerController.getAllCustomers);
router.get('/:id', authMiddleware, CustomerController.getCustomerById);
router.post('/', authMiddleware, CustomerController.createCustomer);
router.put('/:id', authMiddleware, CustomerController.updateCustomer);
router.delete('/:id', authMiddleware, CustomerController.deleteCustomer);

export default router;
