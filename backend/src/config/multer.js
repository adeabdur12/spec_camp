import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createStorage = (subDir) => multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `uploads/${subDir}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = subDir === 'packages' ? 'pkg-' : 'pay-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

const limits = { fileSize: 5 * 1024 * 1024 };

export const uploadPackage = multer({ storage: createStorage('packages'), fileFilter, limits });
export const uploadPayment = multer({ storage: createStorage('payments'), fileFilter, limits });
