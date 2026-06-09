import RoleService from '../services/RoleService.js';

const roleService = new RoleService();

export default class RoleController {
  async getAll(req, res) {
    try {
      const roles = await roleService.findAll();
      res.json({ success: true, data: roles });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPermissions(req, res) {
    try {
      const permissions = await roleService.findAllPermissions();
      res.json({ success: true, data: permissions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRolePermissions(req, res) {
    try {
      const rolePermissions = await roleService.findAllRolePermissions();
      res.json({ success: true, data: rolePermissions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updatePermissions(req, res) {
    try {
      const { permissionIds } = req.body;
      const role = await roleService.updateRolePermissions(req.params.id, permissionIds);
      res.json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const role = await roleService.create(req.body);
      res.status(201).json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const role = await roleService.update(req.params.id, req.body);
      res.json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await roleService.delete(req.params.id);
      res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}