export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('package_events', {
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
      category: {
        type: Sequelize.ENUM('community', 'area'),
        allowNull: false,
        defaultValue: 'community'
      },
      pricePerPax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      mimountShare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      minPax: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      maxPax: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      areaType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dayType: {
        type: Sequelize.ENUM('weekday', 'weekend'),
        allowNull: true
      },
      packageType: {
        type: Sequelize.ENUM('ekonomi', 'full'),
        allowNull: true
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // Add indexes
    await queryInterface.addIndex('package_events', ['category']);
    await queryInterface.addIndex('package_events', ['isActive']);
    await queryInterface.addIndex('package_events', ['isFeatured']);
    await queryInterface.addIndex('package_events', ['packageType']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('package_events');
  }
};
