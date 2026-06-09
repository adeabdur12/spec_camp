export default {
  async up(queryInterface, Sequelize) {
    // Roles
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Permissions
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Role Permissions
    await queryInterface.createTable('role_permissions', {
      roleId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' },
      permissionId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      roleId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 2, references: { model: 'roles', key: 'id' } },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      phone: { type: Sequelize.STRING },
      notifWa: { type: Sequelize.BOOLEAN, defaultValue: false },
      avatar: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Customers
    await queryInterface.createTable('customers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      idCardType: { type: Sequelize.ENUM('ktp', 'sim', 'passport'), defaultValue: 'ktp' },
      idCard: { type: Sequelize.STRING },
      dateOfBirth: { type: Sequelize.DATEONLY },
      address: { type: Sequelize.TEXT },
      emergencyContact: { type: Sequelize.STRING },
      emergencyPhone: { type: Sequelize.STRING },
      notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Package Events
    await queryInterface.createTable('package_events', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      category: { type: Sequelize.ENUM('community', 'area', 'ticket', 'tracking'), allowNull: false, defaultValue: 'area' },
      pricePerPax: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      mimountShare: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      minPax: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      maxPax: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 100 },
      areaType: { type: Sequelize.STRING },
      dayType: { type: Sequelize.ENUM('weekday', 'weekend') },
      packageType: { type: Sequelize.ENUM('ekonomi', 'full') },
      features: { type: Sequelize.JSON, defaultValue: [] },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      isFeatured: { type: Sequelize.BOOLEAN, defaultValue: false },
      imageUrl: { type: Sequelize.TEXT },
      badgeText: { type: Sequelize.STRING },
      perPerson: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Inventory Items
    await queryInterface.createTable('inventory_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.INTEGER, allowNull: false },
      unit: { type: Sequelize.STRING, defaultValue: 'unit' },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      isAvailable: { type: Sequelize.BOOLEAN, defaultValue: true },
      categoryId: { type: Sequelize.STRING, allowNull: false },
      imageUrl: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Services
    await queryInterface.createTable('services', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.INTEGER, allowNull: false },
      unit: { type: Sequelize.STRING, defaultValue: 'orang' },
      type: { type: Sequelize.ENUM('spec_camp', 'mimount', 'eksternal'), defaultValue: 'spec_camp' },
      category: { type: Sequelize.ENUM('guide', 'games', 'ticket', 'transport', 'documentation', 'other'), defaultValue: 'other' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      imageUrl: { type: Sequelize.TEXT },
      isViewPublic: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Package Inventories (junction)
    await queryInterface.createTable('package_inventories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      packageEventId: { type: Sequelize.INTEGER, references: { model: 'package_events', key: 'id' } },
      inventoryItemId: { type: Sequelize.INTEGER, references: { model: 'inventory_items', key: 'id' } },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Package Services (junction)
    await queryInterface.createTable('package_services', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      packageEventId: { type: Sequelize.INTEGER, references: { model: 'package_events', key: 'id' } },
      serviceId: { type: Sequelize.INTEGER, references: { model: 'services', key: 'id' } },
      qtyPerPax: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Bookings
    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.ENUM('walk_in', 'camping', 'event', 'tracking'), defaultValue: 'camping' },
      packageEventId: { type: Sequelize.INTEGER, references: { model: 'package_events', key: 'id' } },
      customerId: { type: Sequelize.INTEGER, references: { model: 'customers', key: 'id' } },
      customerName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING, allowNull: false },
      checkInDate: { type: Sequelize.DATEONLY, allowNull: false },
      checkOutDate: { type: Sequelize.DATEONLY, allowNull: false },
      pax: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      basePrice: { type: Sequelize.DECIMAL(12, 2) },
      inventoryCost: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      serviceCost: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      netRevenue: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      specCampShare: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      mimountShare: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      mimountTotal: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      totalPrice: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'), defaultValue: 'pending' },
      notes: { type: Sequelize.TEXT },
      paymentProof: { type: Sequelize.TEXT },
      bookingCode: { type: Sequelize.STRING(20) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Booking Services (junction)
    await queryInterface.createTable('booking_services', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      bookingId: { type: Sequelize.INTEGER, references: { model: 'bookings', key: 'id' }, onDelete: 'CASCADE' },
      serviceId: { type: Sequelize.INTEGER, references: { model: 'services', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      priceAtBooking: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Booking Inventories (junction)
    await queryInterface.createTable('booking_inventories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      bookingId: { type: Sequelize.INTEGER, references: { model: 'bookings', key: 'id' }, onDelete: 'CASCADE' },
      inventoryItemId: { type: Sequelize.INTEGER, references: { model: 'inventory_items', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      priceAtBooking: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Indexes
    await queryInterface.addIndex('bookings', ['email']);
    await queryInterface.addIndex('bookings', ['status']);
    await queryInterface.addIndex('bookings', ['type']);
    await queryInterface.addIndex('bookings', ['checkInDate']);
    await queryInterface.addIndex('bookings', ['checkOutDate']);
    await queryInterface.addIndex('package_events', ['category']);
    await queryInterface.addIndex('package_events', ['isActive']);
    await queryInterface.addIndex('package_events', ['isFeatured']);
    await queryInterface.addIndex('package_events', ['packageType']);
    await queryInterface.addIndex('users', ['roleId']);
    await queryInterface.addIndex('role_permissions', ['roleId']);
    await queryInterface.addIndex('role_permissions', ['permissionId']);
    await queryInterface.addIndex('booking_inventories', ['bookingId']);
    await queryInterface.addIndex('booking_inventories', ['inventoryItemId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking_inventories');
    await queryInterface.dropTable('booking_services');
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('package_services');
    await queryInterface.dropTable('package_inventories');
    await queryInterface.dropTable('services');
    await queryInterface.dropTable('inventory_items');
    await queryInterface.dropTable('package_events');
    await queryInterface.dropTable('customers');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('roles');
  }
};
