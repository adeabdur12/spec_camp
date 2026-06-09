import db from '../models/index.js';

const { Role, Permission, User, RolePermission } = db;

export default class RoleService {
  async findAll() {
    return await Role.findAll({
      include: [{ model: User }],
      order: [['id', 'ASC']]
    });
  }

  async findById(id) {
    return await Role.findByPk(id, {
      include: [{ model: Permission }]
    });
  }

  async findAllPermissions() {
    return await Permission.findAll();
  }

  async findAllRolePermissions() {
    return await RolePermission.findAll();
  }

  async updateRolePermissions(roleId, permissionIds) {
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error('Role not found');

    await RolePermission.destroy({ where: { roleId } });

    const rolePerms = permissionIds.map(permissionId => ({
      roleId,
      permissionId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await RolePermission.bulkCreate(rolePerms);
    return role;
  }

  async create(data) {
    return await Role.create(data);
  }

  async update(id, data) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error('Role not found');
    return await role.update(data);
  }

  async delete(id) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error('Role not found');

    const protectedRoles = ['admin', 'user'];
    if (protectedRoles.includes(role.name)) {
      throw new Error(`Role "${role.name}" tidak dapat dihapus karena merupakan role bawaan sistem`);
    }
    
    const userCount = await User.count({ where: { roleId: id } });
    if (userCount > 0) throw new Error('Cannot delete role that has users assigned to it');

    await RolePermission.destroy({ where: { roleId: id } });
    return await role.destroy();
  }
}