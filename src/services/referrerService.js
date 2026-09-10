import api from './api'

export const referrerService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams()
    if (params.includeBookings) query.append('includeBookings', '1')
    const qs = query.toString() ? `?${query.toString()}` : ''
    const res = await api.get(`/referrers${qs}`)
    return res.data
  },
  getById: async (id) => {
    const res = await api.get(`/referrers/${id}?includeBookings=1`)
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/referrers', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/referrers/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/referrers/${id}`)
    return res.data
  }
}