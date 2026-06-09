import UserService from '../services/UserService.js';

const userService = new UserService();

export default class UserController {
  async create(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await userService.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await userService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}