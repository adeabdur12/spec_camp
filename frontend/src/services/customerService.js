import api from './api'

export const customerService = {
  getAll: async () => {
    const res = await api.get('/customers')
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/customers', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/customers/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/customers/${id}`)
    return res.data
  }
}
