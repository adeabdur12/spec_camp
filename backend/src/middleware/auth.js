import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User, Role, Permission } = db;

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, include: [Permission] }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.Role?.name,
      permissions: user.Role?.Permissions?.map(p => p.name) || []
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const authenticate = authMiddleware;

export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

export const authorize = requirePermission;

export const requireRole = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role'
      });
    }

    next();
  };
};