import express from 'express';
import { uploadPackage, uploadPayment } from '../config/multer.js';

const router = express.Router();

router.post('/package-image', uploadPackage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file diupload' });
  }

  const url = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.json({
    success: true,
    url: url,
    path: req.file.path
  });
});

router.post('/payment-proof', uploadPayment.single('paymentProof'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file diupload' });
  }

  const url = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.json({
    success: true,
    url: url,
    path: req.file.path
  });
});

router.post('/profile-avatar', uploadPayment.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file diupload' });
  }
  const url = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.json({ success: true, url, path: req.file.path });
});

export default router;
