import api from './api'

export const serviceService = {
  getAll: async () => {
    const res = await api.get('/services')
    return res.data.data
  },
  create: async (data) => {
    const res = await api.post('/services', data)
    return res.data.data
  },
  update: async (id, data) => {
    const res = await api.put(`/services/${id}`, data)
    return res.data.data
  },
  delete: async (id) => {
    const res = await api.delete(`/services/${id}`)
    return res.data
  }
}
