import api from './api'

export const leadService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.status) queryParams.append('status', params.status)
    if (params.category) queryParams.append('category', params.category)
    if (params.search) queryParams.append('search', params.search)
    if (params.district) queryParams.append('district', params.district)
    if (params.priority) queryParams.append('priority', params.priority)

    const url = queryParams.toString() ? `/leads?${queryParams.toString()}` : '/leads'
    const res = await api.get(url)
    return res.data
  },

  getById: async (id) => {
    const res = await api.get(`/leads/${id}`)
    return res.data
  },

  create: async (data) => {
    const res = await api.post('/leads', data)
    return res.data
  },

  update: async (id, data) => {
    const res = await api.put(`/leads/${id}`, data)
    return res.data
  },

  delete: async (id) => {
    const res = await api.delete(`/leads/${id}`)
    return res.data
  },

  getStats: async () => {
    const res = await api.get('/leads/stats')
    return res.data
  },

  getFollowUps: async () => {
    const res = await api.get('/leads/follow-ups')
    return res.data
  },

  import: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/leads/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  downloadTemplate: async () => {
    const res = await api.get('/leads/template', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'template_leads.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  addNote: async (leadId, data) => {
    const res = await api.post(`/leads/${leadId}/notes`, data)
    return res.data
  },

  getNotes: async (leadId) => {
    const res = await api.get(`/leads/${leadId}/notes`)
    return res.data
  }
}
