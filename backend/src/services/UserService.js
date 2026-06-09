import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const { User, Role } = db;

export default class UserService {
  async create(data) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create(data);
    const { password, ...userData } = user.toJSON();
    return userData;
  }

  async findAll() {
    return await User.findAll({
      include: [{ model: Role }],
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      include: [{ model: Role }]
    });
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    const { password, ...userData } = user.toJSON();
    return userData;
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
}