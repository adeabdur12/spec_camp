import db from '../models/index.js';
import jwt from 'jsonwebtoken';

const { User, Role, Permission } = db;

export default class AuthService {
  async login(email, password) {
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role, include: [Permission] }]
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    const permissions = user.Role?.Permissions?.map(p => p.name) || [];
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.Role?.name,
        permissions 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.Role?.name,
        permissions
      },
      token
    };
  }

  async register(data) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create(data);
    const { password, ...userData } = user.toJSON();
    return userData;
  }
}