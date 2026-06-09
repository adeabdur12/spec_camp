import bcrypt from 'bcrypt';

export default {
  async up(queryInterface, Sequelize) {
    const existingAdmin = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@spec.com'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, skipping...');
      return;
    }

    const adminRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminRole.length === 0) {
      console.log('Admin role not found, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrator',
        email: 'admin@spec.com',
        password: hashedPassword,
        roleId: adminRole[0].id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    console.log('Admin user seeded successfully!');
    console.log('Email: admin@spec.com');
    console.log('Password: admin123');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@spec.com' }, {});
  }
};