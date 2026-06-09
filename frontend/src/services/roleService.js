import api from './api'

export const roleService = {
  getAll: async () => {
    const res = await api.get('/roles')
    return res.data
  },
  getPermissions: async () => {
    const res = await api.get('/roles/permissions')
    return res.data
  },
  getRolePermissions: async () => {
    const res = await api.get('/roles/role-permissions')
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/roles', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/roles/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/roles/${id}`)
    return res.data
  },
  updatePermissions: async (id, permissionIds) => {
    const res = await api.put(`/roles/${id}/permissions`, { permissionIds })
    return res.data
  }
}
