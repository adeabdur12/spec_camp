import RoleService from '../services/RoleService.js';

const roleService = new RoleService();

export default class PermissionController {
  async getAll(req, res) {
    try {
      const permissions = await roleService.findAllPermissions();
      res.json({ success: true, data: permissions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}