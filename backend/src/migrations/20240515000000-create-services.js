export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING,
        defaultValue: 'pax'
      },
      category: {
        type: Sequelize.ENUM('guide', 'games', 'ticket', 'transport', 'documentation', 'other'),
        defaultValue: 'other'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      imageUrl: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('services');
  }
};
