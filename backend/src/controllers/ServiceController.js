import ServiceService from '../services/ServiceService.js';

const serviceService = new ServiceService();

export default class ServiceController {
  async create(req, res) {
    try {
      const data = { ...req.body };
      if (data.price) data.price = parseInt(data.price, 10);
      const service = await serviceService.create(data);
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const services = req.query.public === '1'
        ? await serviceService.findAll({ isViewPublic: true, isActive: true })
        : await serviceService.findAll();
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const service = await serviceService.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };
      if (data.price) data.price = parseInt(data.price, 10);
      const service = await serviceService.update(req.params.id, data);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await serviceService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const services = await serviceService.findByCategory(category);
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
