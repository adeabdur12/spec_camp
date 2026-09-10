import affiliateApi from './affiliateApi'

export const affiliateService = {
  async login(payload) {
    return affiliateApi.post('/affiliate/login', payload)
  },
  async register(payload) {
    return affiliateApi.post('/affiliate/register', payload)
  },
  async getMe() {
    return affiliateApi.get('/affiliate/me')
  },
  async getBookings(status) {
    const params = status ? { status } : {}
    return affiliateApi.get('/affiliate/bookings', { params })
  }
}