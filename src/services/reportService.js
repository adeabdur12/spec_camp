import api from './api'

export const reportService = {
  getFinancial: async (startDate, endDate) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const res = await api.get(`/reports/financial?${params.toString()}`)
    return res.data
  }
}
