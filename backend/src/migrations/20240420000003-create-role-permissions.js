export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      permissionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'permissions',
          key: 'id'
        }
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
    await queryInterface.dropTable('role_permissions');
  }
};