export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      checkInDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      checkOutDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      packageType: {
        type: Sequelize.ENUM('personal', 'couple', 'family', 'community'),
        allowNull: false
      },
      numGuests: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};