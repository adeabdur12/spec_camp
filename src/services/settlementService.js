import api from './api'

export const settlementService = {
  getAll: async () => {
    const res = await api.get('/settlements')
    return res.data
  },
  get: async (year, month) => {
    const res = await api.get(`/settlements/${year}/${month}`)
    return res.data
  },
  markPaid: async (year, month, notes = null) => {
    const res = await api.post(`/settlements/${year}/${month}/mark`, { notes })
    return res.data
  },
  unmarkPaid: async (year, month) => {
    const res = await api.delete(`/settlements/${year}/${month}/unmark`)
    return res.data
  }
}
