import api from './api'

const parseFeatures = (pkg) => {
  if (!pkg) return pkg
  if (typeof pkg.features === 'string') {
    try { pkg.features = JSON.parse(pkg.features) } catch { pkg.features = [] }
  }
  if (!Array.isArray(pkg.features)) pkg.features = []
  return pkg
}

const parsePackages = (data) => {
  if (Array.isArray(data)) return data.map(parseFeatures)
  return parseFeatures(data)
}

export const packageService = {
  getAll: async () => {
    const res = await api.get('/package-events')
    return parsePackages(res.data.data)
  },
  getByCategory: async (category) => {
    const res = await api.get(`/package-events/category/${category}`)
    return parsePackages(res.data.data)
  },
  create: async (data) => {
    const res = await api.post('/package-events', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/package-events/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/package-events/${id}`)
    return res.data
  }
}
