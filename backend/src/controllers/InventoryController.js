import InventoryService from '../services/InventoryService.js';

const inventoryService = new InventoryService();

export default class InventoryController {
  async create(req, res) {
    try {
      const data = { ...req.body };

      if (req.file) {
        data.imageUrl = `/uploads/inventory/${req.file.filename}`;
      }

      if (data.price) data.price = parseInt(data.price, 10);
      if (data.stock) data.stock = parseInt(data.stock, 10);
      data.isAvailable = data.isAvailable === 'true' || data.isAvailable === true;

      const item = await inventoryService.create(data);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const items = await inventoryService.findAll();
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const item = await inventoryService.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = { ...req.body };

      if (req.file) {
        data.imageUrl = `/uploads/inventory/${req.file.filename}`;
      }

      if (data.price) data.price = parseInt(data.price, 10);
      if (data.stock) data.stock = parseInt(data.stock, 10);
      if (data.isAvailable !== undefined) {
        data.isAvailable = data.isAvailable === 'true' || data.isAvailable === true;
      }

      const item = await inventoryService.update(req.params.id, data);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await inventoryService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const items = await inventoryService.findByCategory(categoryId);
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
