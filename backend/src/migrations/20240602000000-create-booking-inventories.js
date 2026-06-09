export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_inventories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bookings', key: 'id' },
        onDelete: 'CASCADE'
      },
      inventoryItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inventory_items', key: 'id' },
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      priceAtBooking: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('booking_inventories', ['bookingId']);
    await queryInterface.addIndex('booking_inventories', ['inventoryItemId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking_inventories');
  }
};
