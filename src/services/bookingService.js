import api from './api'

export const bookingService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.status) queryParams.append('status', params.status)
    
    const url = queryParams.toString() ? `/bookings?${queryParams.toString()}` : '/bookings'
    const res = await api.get(url)
    return res.data
  },
  getStats: async () => {
    const res = await api.get('/bookings/report/financial')
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/bookings', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/bookings/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/bookings/${id}`)
    return res.data
  }
}
