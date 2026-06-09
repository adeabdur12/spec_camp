import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import InventoryController from '../controllers/InventoryController.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/inventory'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `item-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
});

const router = express.Router();
const inventoryController = new InventoryController();

router.get('/', inventoryController.getAll);
router.get('/category/:categoryId', inventoryController.getByCategory);
router.get('/:id', inventoryController.getById);
router.post('/', authMiddleware, upload.single('image'), inventoryController.create);
router.put('/:id', authMiddleware, upload.single('image'), inventoryController.update);
router.delete('/:id', authMiddleware, inventoryController.delete);

export default router;
