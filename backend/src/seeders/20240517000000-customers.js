export default {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT id FROM customers LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing.length > 0) {
      console.log('Customers already exist, skipping seed...');
      return;
    }

    await queryInterface.bulkInsert('customers', [
      { name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890', idCardType: 'ktp', idCard: '3273010101900001', address: 'Jl. Merdeka No. 1, Jakarta', emergencyContact: 'Siti', emergencyPhone: '081298765432', notes: '', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Siti Rahmawati', email: 'siti@example.com', phone: '081234567891', idCardType: 'ktp', idCard: '3273010101900002', address: 'Jl. Sudirman No. 10, Bandung', emergencyContact: 'Ahmad', emergencyPhone: '081298765433', notes: 'Pernah booking 2x', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ahmad Fauzi', email: 'ahmad@example.com', phone: '081234567892', idCardType: 'sim', idCard: '6273010101900001', address: 'Perumahan Griya Asri Blok A5, Surabaya', emergencyContact: 'Fatimah', emergencyPhone: '081298765434', notes: '', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dewi Lestari', email: 'dewi@example.com', phone: '081234567893', idCardType: 'ktp', idCard: '3273010101900003', address: 'Jl. Kenanga No. 5, Yogyakarta', emergencyContact: 'Joko', emergencyPhone: '081298765435', notes: 'Alergi seafood', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rudi Hidayat', email: 'rudi@example.com', phone: '081234567894', idCardType: 'passport', idCard: 'A1234567', address: 'Komplek Permata Hijau Blok C12, Semarang', emergencyContact: 'Rina', emergencyPhone: '081298765436', notes: '', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ani Wulandari', email: 'ani@example.com', phone: '081234567895', idCardType: 'ktp', idCard: '3273010101900004', address: 'Jl. Mawar Indah No. 3, Bogor', emergencyContact: 'Bagus', emergencyPhone: '081298765437', notes: 'Request vegetarian food', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Doni Prasetyo', email: 'doni@example.com', phone: '081234567896', idCardType: 'ktp', idCard: '3273010101900005', address: 'Perumahan Pondok Indah Blok D8, Tangerang', emergencyContact: 'Susanti', emergencyPhone: '081298765438', notes: '', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mega Putri', email: 'mega@example.com', phone: '081234567897', idCardType: 'sim', idCard: '6273010101900002', address: 'Jl. Anggrek No. 8, Malang', emergencyContact: 'Hendra', emergencyPhone: '081298765439', notes: 'Member premium', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Agus Wijaya', email: 'agus@example.com', phone: '081234567898', idCardType: 'ktp', idCard: '3273010101900006', address: 'Griya Kencana Residence Blok F2, Bekasi', emergencyContact: 'Eko', emergencyPhone: '081298765440', notes: '', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rina Marlina', email: 'rina@example.com', phone: '081234567899', idCardType: 'passport', idCard: 'B7654321', address: 'Jl. Pahlawan No. 15, Medan', emergencyContact: 'Tono', emergencyPhone: '081298765441', notes: 'Sering booking untuk gathering kantor', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
