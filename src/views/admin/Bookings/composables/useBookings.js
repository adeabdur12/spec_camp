import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { bookingService } from '../../../../services/bookingService'
import { settlementService } from '../../../../services/settlementService'
import api from '../../../../services/api'

export function useBookings() {
  // State
  const loading = ref(true)
  const saving = ref(false)
  const bookings = ref([])
  const packages = ref([])
  const customers = ref([])
  const serviceList = ref([])
  const inventoryList = ref([])
  const settlements = ref([])
  const showModal = ref(false)
  const editingId = ref(null)
  const errorMessage = ref('')
  const filter = ref('all')

  // Pagination state
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalItems = ref(0)
  const totalPages = ref(0)

  // UI state
  const showConfirm = ref(false)
  const confirmTitle = ref('')
  const confirmMessage = ref('')
  const itemToDelete = ref(null)
  const statusOpenId = ref(null)
  const actionsOpenId = ref(null)
  const showDetail = ref(false)
  const detailBooking = ref(null)
  const showImagePreview = ref(null)
  const copiedId = ref(null)

  // Form
  const initialForm = {
    type: 'camping',
    packageEventId: '',
    customerId: '',
    customerName: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    pax: 1,
    freePax: 0,
    status: 'pending',
    notes: '',
    totalPrice: 0,
    paymentProof: '',
    paidAt: '',
    paymentMethod: '',
    sendWhatsapp: false,
    extraServices: [],
    inventoryItems: []
  }

  const form = ref({ ...initialForm })

  // Computed
  const confirmedBookings = computed(() => bookings.value.filter(b => b.status === 'confirmed'))
  const pendingBookings = computed(() => bookings.value.filter(b => b.status === 'pending'))
  const totalRevenue = computed(() => bookings.value.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + Number(b.totalPrice || 0), 0))

  // Methods
  const fetchBookings = async () => {
    loading.value = true
    try {
      const res = await bookingService.getAll({
        page: currentPage.value,
        limit: itemsPerPage.value,
        status: filter.value
      })
      bookings.value = res.data || []
      if (res.pagination) {
        totalItems.value = res.pagination.total
        totalPages.value = res.pagination.totalPages
      }
    } catch (err) {
      console.error('Gagal mengambil data reservasi:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers')
      customers.value = res.data.data || res.data
    } catch (err) {
      console.error('Gagal mengambil data pelanggan:', err)
    }
  }

  const fetchPackages = async () => {
    try {
      const res = await api.get('/package-events')
      packages.value = res.data.data || res.data
    } catch (err) {
      console.error('Gagal mengambil paket kegiatan:', err)
    }
  }

  const fetchServices = async () => {
    try {
      const res = await api.get('/services')
      serviceList.value = res.data.data || res.data
    } catch (err) {
      console.error('Gagal mengambil layanan:', err)
    }
  }

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory')
      inventoryList.value = res.data.data || res.data
    } catch (err) {
      console.error('Gagal mengambil inventory:', err)
    }
  }

  const fetchSettlements = async () => {
    try {
      const res = await settlementService.getAll()
      settlements.value = res.data || []
    } catch (err) {
      console.error('Gagal mengambil data settlement:', err)
    }
  }

  const isBookingSettled = (booking) => {
    if (!booking.checkInDate || booking.status !== 'completed') return false
    const d = new Date(booking.checkInDate)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    return settlements.value.some(s => s.year === year && s.month === month && s.paidAt)
  }

  const openModal = (booking = null) => {
    if (booking) {
      editingId.value = booking.id
      form.value = { 
        ...booking,
        checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '',
        checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().split('T')[0] : '',
        paidAt: booking.paidAt ? new Date(booking.paidAt).toISOString().split('T')[0] : '',
        extraServices: booking.ExtraServices ? booking.ExtraServices.map(s => ({
          id: s.id,
          quantity: s.BookingService?.quantity || 1
        })) : [],
        inventoryItems: booking.InventoryItems ? booking.InventoryItems.map(i => ({
          id: i.id,
          quantity: i.BookingInventory?.quantity || 1
        })) : []
      }
    } else {
      editingId.value = null
      form.value = JSON.parse(JSON.stringify(initialForm))
    }
    form.value.freePax = form.value.freePax || 0
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    editingId.value = null
    errorMessage.value = ''
  }

  const saveBooking = async () => {
    saving.value = true
    errorMessage.value = ''
    try {
      const payload = {
        ...form.value,
        extraServices: form.value.extraServices.filter(s => s.id),
        inventoryItems: form.value.inventoryItems.filter(i => i.id)
      }
      if (editingId.value) {
        await bookingService.update(editingId.value, payload)
      } else {
        await bookingService.create(payload)
      }
      await fetchBookings()
      closeModal()
    } catch (err) {
      console.error('Gagal menyimpan reservasi:', err)
      errorMessage.value = err.response?.data?.message || 'Gagal menyimpan data reservasi.'
    } finally {
      saving.value = false
    }
  }

  const updateStatus = async (booking, newStatus) => {
    if (booking.status === newStatus) return
    statusOpenId.value = null
    
    try {
      await bookingService.update(booking.id, { ...booking, status: newStatus })
      await fetchBookings()
    } catch (err) {
      console.error('Gagal update status:', err)
    }
  }

  const deleteBooking = (id) => {
    itemToDelete.value = id
    confirmTitle.value = 'Hapus Reservasi'
    confirmMessage.value = 'Apakah Anda yakin ingin menghapus reservasi ini?'
    showConfirm.value = true
  }

  const executeDelete = async () => {
    if (!itemToDelete.value) return
    
    try {
      await bookingService.delete(itemToDelete.value)
      await fetchBookings()
    } catch (err) {
      console.error('Gagal menghapus reservasi:', err)
    } finally {
      showConfirm.value = false
      itemToDelete.value = null
    }
  }

  const viewDetail = (booking) => {
    detailBooking.value = booking
    showDetail.value = true
  }

  const closeDetailModal = () => {
    showDetail.value = false
    detailBooking.value = null
  }

  const copyBookingLink = async (booking) => {
    const url = `https://speccamp.site/search-booking?code=${booking.bookingCode}`
    try {
      await navigator.clipboard.writeText(url)
      copiedId.value = booking.id
      setTimeout(() => { copiedId.value = null }, 2000)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      copiedId.value = booking.id
      setTimeout(() => { copiedId.value = null }, 2000)
    }
  }

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchBookings()
    }
  }

  const nextPage = () => goToPage(currentPage.value + 1)
  const prevPage = () => goToPage(currentPage.value - 1)

  // Watchers
  watch(filter, () => {
    currentPage.value = 1
    fetchBookings()
  })

  watch([() => form.value.packageEventId, () => form.value.pax, () => form.value.freePax, () => form.value.extraServices, () => form.value.inventoryItems], ([newPkgId, newPax, newFreePax, newExtras, newInventory]) => {
    let total = 0
    const freePax = Math.min(newFreePax || 0, Math.max(0, (newPax || 1) - 1))
    const effectivePax = (newPax || 1) - freePax
    if (newPkgId && effectivePax) {
      const pkg = packages.value.find(p => p.id === newPkgId)
      if (pkg) {
        total += Number(pkg.pricePerPax) * effectivePax
      }
    }
    
    if (newExtras && newExtras.length > 0) {
      newExtras.forEach(svc => {
        const item = serviceList.value.find(s => s.id === svc.id)
        if (item) {
          total += Number(item.price) * (Number(svc.quantity) || 1)
        }
      })
    }

    if (newInventory && newInventory.length > 0) {
      newInventory.forEach(inv => {
        const item = inventoryList.value.find(i => i.id === inv.id)
        if (item) {
          total += Number(item.price) * (Number(inv.quantity) || 1)
        }
      })
    }
    
    form.value.totalPrice = total
  }, { deep: true })

  watch(() => form.value.checkInDate, (date) => {
    if (date && !form.value.checkOutDate) {
      const d = new Date(date)
      d.setDate(d.getDate() + 1)
      form.value.checkOutDate = d.toISOString().split('T')[0]
    }
  })

  // Lifecycle
  const closeActionsDropdown = () => {
    statusOpenId.value = null
    actionsOpenId.value = null
  }

  onMounted(() => {
    fetchBookings()
    fetchPackages()
    fetchCustomers()
    fetchServices()
    fetchInventory()
    fetchSettlements()
    document.addEventListener('click', closeActionsDropdown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeActionsDropdown)
  })

  return {
    // State
    loading,
    saving,
    bookings,
    packages,
    customers,
    serviceList,
    inventoryList,
    settlements,
    showModal,
    editingId,
    errorMessage,
    filter,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    showConfirm,
    confirmTitle,
    confirmMessage,
    itemToDelete,
    statusOpenId,
    actionsOpenId,
    showDetail,
    detailBooking,
    showImagePreview,
    copiedId,
    form,
    // Computed
    confirmedBookings,
    pendingBookings,
    totalRevenue,
    // Methods
    fetchBookings,
    openModal,
    closeModal,
    saveBooking,
    updateStatus,
    deleteBooking,
    executeDelete,
    viewDetail,
    closeDetailModal,
    copyBookingLink,
    isBookingSettled,
    goToPage,
    nextPage,
    prevPage,
    toggleStatus: (id) => { statusOpenId.value = statusOpenId.value === id ? null : id },
    toggleActions: (id) => { actionsOpenId.value = actionsOpenId.value === id ? null : id }
  }
}
