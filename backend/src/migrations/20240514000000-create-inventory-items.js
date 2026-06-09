export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_items', {
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
        defaultValue: 'unit'
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      categoryId: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('inventory_items');
  }
};
