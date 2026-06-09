import * as ReportService from '../services/ReportService.js';

export const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await ReportService.getFinancialStats(startDate, endDate);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
