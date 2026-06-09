import cron from 'node-cron';
import db from '../models/index.js';
import { Op } from 'sequelize';

const { Booking } = db;

export const startBookingScheduler = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Checking expired bookings...');
    try {
      const today = new Date().toISOString().split('T')[0];
      const [updated] = await Booking.update(
        { status: 'completed' },
        {
          where: {
            status: 'confirmed',
            checkOutDate: { [Op.lt]: today }
          }
        }
      );
      if (updated > 0) {
        console.log(`[Scheduler] ${updated} bookings marked as completed`);
      }
    } catch (e) {
      console.error('[Scheduler] Error:', e.message);
    }
  });

  console.log('[Scheduler] Booking auto-complete job started (every hour)');
};
