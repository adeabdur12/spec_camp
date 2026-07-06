import api from './api'

export const bookingService = {
  getAll: async () => {
    const res = await api.get('/bookings')
    return res.data.data
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
