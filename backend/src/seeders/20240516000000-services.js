export default {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT id FROM services LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing.length > 0) {
      console.log('Services already exist, skipping seed...');
      return;
    }

    await queryInterface.bulkInsert('services', [
      // A. Jasa Pemandu (Guide)
      { name: 'Jasa Pemandu Tracking', description: 'Pemandu profesional untuk tracking & hiking di area Spec Camp', price: 150000, unit: 'orang', category: 'guide', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jasa Pemandu Outbound', description: 'Fasilitator games dan outbound untuk kelompok', price: 200000, unit: 'orang', category: 'guide', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Guide Interpretasi Alam', description: 'Pemandu yang menjelaskan flora, fauna, dan geologi sekitar', price: 100000, unit: 'orang', category: 'guide', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Guide Camping', description: 'Pendamping camping termasuk demo setup tenda', price: 100000, unit: 'orang', category: 'guide', isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // B. Games & Outbound
      { name: 'Fun Games Sesi Pagi', description: 'Ice breaking dan games ringan (1 jam)', price: 25000, unit: 'orang', category: 'games', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outbound Half Day', description: 'Rangkaian games outbound 3-4 jam termasuk flying fox', price: 75000, unit: 'orang', category: 'games', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outbound Full Day', description: 'Outbound lengkap 6-7 jam dengan makan siang', price: 125000, unit: 'orang', category: 'games', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Night Game (Api Unggun)', description: 'Games malam seru dengan api unggun dan storytelling', price: 20000, unit: 'orang', category: 'games', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Team Building Excel', description: 'Program team building komprehensif dengan fasilitator khusus', price: 250000, unit: 'orang', category: 'games', isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // C. Tiket Masuk
      { name: 'Tiket Masuk Dewasa', description: 'Tiket masuk area camping Spec Camp', price: 35000, unit: 'orang', category: 'ticket', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tiket Masuk Anak', description: 'Tiket masuk anak usia 3-12 tahun', price: 20000, unit: 'orang', category: 'ticket', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tiket Masuk Group', description: 'Minimal 25 orang', price: 25000, unit: 'orang', category: 'ticket', isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // D. Transportasi
      { name: 'Shuttle Drop-off', description: 'Antar dari pintu gerbang ke lokasi camping', price: 10000, unit: 'orang', category: 'transport', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Shuttle Pick-up', description: 'Jemput dari lokasi camping ke pintu gerbang', price: 10000, unit: 'orang', category: 'transport', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Angkut Barang', description: 'Angkut perlengkapan dari parkir ke lokasi camping', price: 25000, unit: 'orang', category: 'transport', isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // E. Dokumentasi
      { name: 'Fotografi Basic', description: 'Dokumentasi foto 50+ hasil edit (2 jam)', price: 200000, unit: 'orang', category: 'documentation', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fotografi Premium', description: 'Dokumentasi foto+video 100+ hasil + drone (4 jam)', price: 500000, unit: 'orang', category: 'documentation', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cetak Foto Instan', description: 'Cetak foto polaroid instan untuk kenang-kenangan', price: 15000, unit: 'orang', category: 'documentation', isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // F. Lainnya
      { name: 'Sewa Sound System', description: 'Sound system portable untuk acara kelompok', price: 150000, unit: 'orang', category: 'other', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Karaoke Mini', description: 'Set karaoke outdoor lengkap dengan mic & layar', price: 100000, unit: 'orang', category: 'other', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bantuan Medis', description: 'Petugas P3K stand by selama acara', price: 75000, unit: 'orang', category: 'other', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Paket Kayu Bakar', description: 'Kayu bakar untuk api unggun (isi ±5 kg)', price: 25000, unit: 'orang', category: 'other', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Paket Snack Box', description: 'Snack box berisi kue, roti, dan minuman', price: 20000, unit: 'orang', category: 'other', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  }
};
