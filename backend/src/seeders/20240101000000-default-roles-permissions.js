export default {
  async up(queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(
      'SELECT id FROM roles',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (roles.length > 0) {
      console.log('Roles already exist, skipping seed...');
      return;
    }

    await queryInterface.bulkInsert('roles', [
      { name: 'admin', description: 'Administrator', createdAt: new Date(), updatedAt: new Date() },
      { name: 'user', description: 'Regular User', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    await queryInterface.bulkInsert('permissions', [
      { name: 'view_booking', description: 'View bookings', createdAt: new Date(), updatedAt: new Date() },
      { name: 'create_booking', description: 'Create bookings', createdAt: new Date(), updatedAt: new Date() },
      { name: 'update_booking', description: 'Update bookings', createdAt: new Date(), updatedAt: new Date() },
      { name: 'delete_booking', description: 'Delete bookings', createdAt: new Date(), updatedAt: new Date() },
      { name: 'manage_user', description: 'Manage users', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    const adminRoleId = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE name = "admin"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const adminPerms = await queryInterface.sequelize.query(
      'SELECT id FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const rolePerms = adminPerms.map(permission => ({
      roleId: adminRoleId[0].id,
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('role_permissions', rolePerms, {});

    console.log('Default roles and permissions seeded successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};