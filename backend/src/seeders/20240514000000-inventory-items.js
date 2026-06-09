export default {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT id FROM inventory_items LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing.length > 0) {
      console.log('Inventory items already exist, skipping seed...');
      return;
    }

    await queryInterface.bulkInsert('inventory_items', [
      // A. Tenda & Perlengkapan Tidur
      { name: 'Tenda Camping Biasa', description: 'Kapasitas 4-5 orang', price: 50000, unit: 'unit', stock: 10, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tenda Camping Besar', description: 'Kapasitas 8-10 orang', price: 100000, unit: 'unit', stock: 5, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tenda SPEEDS (Single Layer)', description: 'Kapasitas 2-3 orang (+ Flysheet)', price: 20000, unit: 'unit', stock: 10, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Matras Gulung', description: 'Nyaman dan empuk', price: 5000, unit: 'pcs', stock: 20, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Matras Tenda', description: 'Ukuran tenda kapasitas 4', price: 10000, unit: 'pcs', stock: 15, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sleeping Bag', description: 'Hangat dan bersih', price: 10000, unit: 'pcs', stock: 20, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bantal Angin', description: 'Simpel dan praktis', price: 5000, unit: 'pcs', stock: 25, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hammock', description: 'Ukuran 250 x 150 cm', price: 10000, unit: 'unit', stock: 8, isAvailable: true, categoryId: 'shelter', createdAt: new Date(), updatedAt: new Date() },

      // B. Perlengkapan Masak & Makan
      { name: 'Kompor Kotak', description: 'Portable dengan koper', price: 10000, unit: 'unit', stock: 8, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kompor Portable Mini', description: 'Mini dan praktis', price: 5000, unit: 'unit', stock: 10, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gas Portable', description: 'Isi ulang', price: 10000, unit: 'unit', stock: 15, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Nesting', description: 'Alat masak steril', price: 5000, unit: 'set', stock: 10, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Peralatan Makan', description: 'Set isi 4 pcs', price: 5000, unit: 'set', stock: 10, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Teko', description: 'Kapasitas 1.1 Liter', price: 5000, unit: 'unit', stock: 8, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Galon Lipat', description: 'Kapasitas 5 Liter', price: 5000, unit: 'unit', stock: 10, isAvailable: true, categoryId: 'cooking', createdAt: new Date(), updatedAt: new Date() },

      // C. Furnitur & Pendukung Outdoor
      { name: 'Meja Lipat', description: 'Dimensi 53 x 51 x 50 cm', price: 15000, unit: 'unit', stock: 15, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kursi Lipat', description: 'Model simpel dan kokoh', price: 15000, unit: 'pcs', stock: 40, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Flysheet', description: 'Ukuran 200x300 / 300x400 cm', price: 8000, unit: 'unit', stock: 10, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tiang Flysheet', description: 'Panjang 200 cm', price: 10000, unit: 'unit', stock: 10, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tracking Pole', description: 'Teleskopik hiking pole', price: 15000, unit: 'unit', stock: 8, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tas Carrier', description: 'Kapasitas 60 Liter', price: 15000, unit: 'unit', stock: 6, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Headlamp / Lampu Tenda', description: 'Penerangan malam hari', price: 5000, unit: 'pcs', stock: 30, isAvailable: true, categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date() },

      // D. Jasa & Layanan Operasional
      { name: 'Jasa Bongkar Pasang Tenda', description: 'Kapasitas 4-5 Orang', price: 20000, unit: 'unit', stock: 99, isAvailable: true, categoryId: 'others', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jasa Bongkar Pasang Tenda Besar', description: 'Kapasitas 8-10 Orang', price: 30000, unit: 'unit', stock: 99, isAvailable: true, categoryId: 'others', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventory_items', null, {});
  }
};
