import db from '../models/index.js';
const { Permission, Role, RolePermission } = db;

const fixPermissions = async () => {
  try {
    console.log('--- Fixing Package Permissions ---');
    
    // 1. Create missing permissions
    const packagePerms = [
      { name: 'view_package', description: 'Can view packages' },
      { name: 'create_package', description: 'Can create packages' },
      { name: 'update_package', description: 'Can update packages' },
      { name: 'delete_package', description: 'Can delete packages' }
    ];

    for (const p of packagePerms) {
      await Permission.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
    }

    // 2. Assign all permissions to Admin role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (adminRole) {
      const allPerms = await Permission.findAll();
      for (const perm of allPerms) {
        await RolePermission.findOrCreate({
          where: { roleId: adminRole.id, permissionId: perm.id }
        });
      }
      console.log('All permissions assigned to Admin role.');
    } else {
      console.log('Admin role not found.');
    }

    console.log('--- Done ---');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing permissions:', error);
    process.exit(1);
  }
};

fixPermissions();
