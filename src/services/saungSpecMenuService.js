import api from './api'

export const saungSpecMenuService = {
  getAll: async () => {
    const res = await api.get('/saung-spec-menus')
    return res.data.data
  },
  getPublic: async () => {
    const res = await api.get('/saung-spec-menus/public')
    return res.data.data
  },
  create: async (data) => {
    const res = await api.post('/saung-spec-menus', data)
    return res.data.data
  },
  update: async (id, data) => {
    const res = await api.put(`/saung-spec-menus/${id}`, data)
    return res.data.data
  },
  delete: async (id) => {
    const res = await api.delete(`/saung-spec-menus/${id}`)
    return res.data
  }
}
