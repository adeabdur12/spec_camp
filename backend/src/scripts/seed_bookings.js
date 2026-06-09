import db from '../models/index.js';
const { Booking, PackageEvent } = db;

const seedBookings = async () => {
  try {
    console.log('--- Seeding Bookings ---');
    
    // Clear existing bookings
    await Booking.destroy({ where: {} });

    const packages = await PackageEvent.findAll();
    if (packages.length === 0) {
      console.log('No packages found. Please seed packages first.');
      process.exit(1);
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const bookingData = [
      {
        customerName: 'Ade Abdurahman',
        email: 'ade@example.com',
        phone: '08123456789',
        type: 'event',
        packageEventId: packages.find(p => p.name.includes('Plus Gathering'))?.id || packages[0].id,
        pax: 30,
        checkInDate: '2026-06-10',
        checkOutDate: '2026-06-11',
        status: 'confirmed',
        notes: 'Grup kantor, butuh api unggun besar.'
      },
      {
        customerName: 'Siti Aminah',
        email: 'siti@example.com',
        phone: '08556677889',
        type: 'camping',
        packageEventId: packages.find(p => p.name.includes('Area A'))?.id || packages[0].id,
        pax: 4,
        checkInDate: '2026-06-15',
        checkOutDate: '2026-06-16',
        status: 'pending',
        notes: 'Pilih area paling atas.'
      },
      {
        customerName: 'Budi Santoso',
        email: 'budi@example.com',
        phone: '08991122334',
        type: 'tracking',
        packageEventId: packages.find(p => p.name.includes('Tracking Curug'))?.id || packages[0].id,
        pax: 10,
        checkInDate: '2026-06-20',
        checkOutDate: '2026-06-20',
        status: 'completed',
        notes: 'Bawa anak kecil.'
      }
    ];

    for (const b of bookingData) {
      // We use the service to create booking so it calculates revenue automatically
      // But since we are in a script, we'll import the service logic or just call the API?
      // Better: Use the service directly.
      const { createBooking } = await import('../services/BookingService.js');
      await createBooking(b);
    }

    console.log('--- Booking Seeding Completed ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
};

seedBookings();
