import axios from 'axios'

const affiliateApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

affiliateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('aff_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

affiliateApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aff_token')
      localStorage.removeItem('aff_user')
      window.location.href = '/affiliate'
    }
    return Promise.reject(err)
  }
)

export default affiliateApi