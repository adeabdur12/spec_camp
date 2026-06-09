import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    if (process.env.NODE_ENV !== 'production') {
      // Add paymentProof column if missing
      try {
        await sequelize.query("ALTER TABLE bookings ADD COLUMN paymentProof TEXT AFTER notes");
      } catch (e) {
        if (!e.message?.includes('Duplicate column')) {
          console.log('Column paymentProof already exists');
        }
      }
      try {
        await sequelize.query("ALTER TABLE package_events ADD COLUMN perPerson TEXT AFTER badgeText");
      } catch (e) {
        if (!e.message?.includes('Duplicate column')) {
          console.log('Column perPerson already exists');
        }
      }
      try {
        await sequelize.query("ALTER TABLE bookings MODIFY email VARCHAR(255) NULL");
      } catch (e) {
        console.log('Email column modified');
      }
      try {
        await sequelize.query("ALTER TABLE bookings ADD COLUMN bookingCode VARCHAR(20) AFTER paymentProof");
      } catch (e) {
        if (!e.message?.includes('Duplicate column')) {
          console.log('Column bookingCode already exists');
        }
      }
      try {
        await sequelize.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER isActive");
      } catch (e) {
        if (!e.message?.includes('Duplicate column')) {
          console.log('Column phone already exists');
        }
      }
      try {
        await sequelize.query("ALTER TABLE users ADD COLUMN avatar TEXT AFTER notifWa");
      } catch (e) {
        if (!e.message?.includes('Duplicate column')) {
          console.log('Column avatar already exists');
        }
      }
      try {
        await sequelize.query("ALTER TABLE services ADD COLUMN isViewPublic TINYINT(1) DEFAULT 0 AFTER imageUrl");
      } catch (e) {
        if (!e.message?.includes('Duplicate column')) {
          console.log('Column isViewPublic already exists');
        }
      }
      // Seed missing permissions
      try {
        const missingPerms = [
          ['view_dashboard', 'Melihat halaman dashboard'],
          ['view_package', 'Melihat daftar paket & event'],
          ['create_package', 'Membuat paket baru'],
          ['update_package', 'Memperbarui paket'],
          ['delete_package', 'Menghapus paket'],
          ['view_inventory', 'Melihat inventory'],
          ['view_service', 'Melihat layanan'],
          ['view_customer', 'Melihat pelanggan'],
          ['view_report', 'Melihat laporan'],
          ['manage_role', 'Mengelola peran'],
          ['manage_settings', 'Pengaturan sistem']
        ]
        for (const [name, desc] of missingPerms) {
          await sequelize.query(
            "INSERT IGNORE INTO permissions (name, description, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())",
            { replacements: [name, desc] }
          )
        }
        // Assign all permissions to admin role (id=1)
        const adminRole = await sequelize.query("SELECT id FROM roles WHERE id = 1", { type: 'SELECT' })
        if (adminRole.length > 0) {
          await sequelize.query(
            "INSERT IGNORE INTO role_permissions (roleId, permissionId, createdAt, updatedAt) SELECT 1, id, NOW(), NOW() FROM permissions"
          )
        }
      } catch (e) {
        console.log('Permissions seed:', e.message)
      }
      console.log('Database sync skipped (manual)');
    }
    
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
});

export default app;