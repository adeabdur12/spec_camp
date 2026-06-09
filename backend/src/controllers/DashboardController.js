import * as DashboardService from '../services/DashboardService.js';

export const getStats = async (req, res) => {
  try {
    const stats = await DashboardService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
