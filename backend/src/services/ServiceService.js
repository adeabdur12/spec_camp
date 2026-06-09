import db from '../models/index.js';

const { Service } = db;

export default class ServiceService {
  async create(data) {
    return await Service.create(data);
  }

  async findAll(where = {}) {
    return await Service.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    return await Service.findByPk(id);
  }

  async update(id, data) {
    const service = await Service.findByPk(id);
    if (!service) return null;
    return await service.update(data);
  }

  async delete(id) {
    const service = await Service.findByPk(id);
    if (!service) return false;
    await service.destroy();
    return true;
  }

  async findByCategory(category) {
    return await Service.findAll({
      where: { category, isActive: true },
      order: [['name', 'ASC']]
    });
  }
}
