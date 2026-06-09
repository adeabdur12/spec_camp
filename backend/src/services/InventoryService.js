import db from '../models/index.js';

const { InventoryItem } = db;

export default class InventoryService {
  async create(data) {
    return await InventoryItem.create(data);
  }

  async findAll() {
    return await InventoryItem.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    return await InventoryItem.findByPk(id);
  }

  async update(id, data) {
    const item = await InventoryItem.findByPk(id);
    if (!item) return null;
    return await item.update(data);
  }

  async delete(id) {
    const item = await InventoryItem.findByPk(id);
    if (!item) return false;
    await item.destroy();
    return true;
  }

  async findByCategory(categoryId) {
    return await InventoryItem.findAll({
      where: { categoryId },
      order: [['createdAt', 'DESC']]
    });
  }
}
