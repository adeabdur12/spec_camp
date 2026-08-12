import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { leadService } from '../services/leadService'

export function useCRM() {
  const loading = ref(true)
  const saving = ref(false)
  const leads = ref([])
  const stats = ref(null)
  const followUps = ref({ overdue: [], today: [], thisWeek: [] })

  // Filters
  const activeTab = ref('leads')
  const search = ref('')
  const statusFilter = ref('all')
  const categoryFilter = ref('all')
  const priorityFilter = ref('all')

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  const totalItems = ref(0)
  const totalPages = ref(0)

  // UI state
  const showModal = ref(false)
  const showImportModal = ref(false)
  const showDrawer = ref(false)
  const selectedLead = ref(null)
  const editingLead = ref(null)
  const showConfirm = ref(false)
  const confirmTitle = ref('')
  const confirmMessage = ref('')
  const itemToDelete = ref(null)
  const formError = ref('')

  // Form
  const initialForm = {
    category: 'sekolah',
    name: '',
    type: '',
    address: '',
    district: '',
    phone: '',
    whatsapp: '',
    email: '',
    contactPerson: '',
    contactRole: '',
    googleMapsUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    status: 'belum_dihubungi',
    priority: 'medium',
    estimatedPax: '',
    interestedPackage: '',
    nextFollowUpDate: '',
    notes: ''
  }
  const form = ref({ ...initialForm })

  const fetchLeads = async () => {
    loading.value = true
    try {
      const res = await leadService.getAll({
        page: currentPage.value,
        limit: itemsPerPage.value,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
        category: categoryFilter.value !== 'all' ? categoryFilter.value : undefined,
        priority: priorityFilter.value !== 'all' ? priorityFilter.value : undefined,
        search: search.value || undefined
      })
      leads.value = res.data || []
      if (res.pagination) {
        totalItems.value = res.pagination.total
        totalPages.value = res.pagination.totalPages
      }
    } catch (err) {
      console.error('Gagal mengambil data leads:', err)
      if (leads.value.length === 0) leads.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      const res = await leadService.getStats()
      stats.value = res.data
    } catch (err) {
      console.error('Gagal mengambil statistik:', err)
    }
  }

  const fetchFollowUps = async () => {
    try {
      const res = await leadService.getFollowUps()
      followUps.value = res.data
    } catch (err) {
      console.error('Gagal mengambil data follow-up:', err)
    }
  }

  const openModal = (lead = null) => {
    formError.value = ''
    if (lead) {
      editingLead.value = lead
      form.value = {
        category: lead.category || 'sekolah',
        name: lead.name || '',
        type: lead.type || '',
        address: lead.address || '',
        district: lead.district || '',
        phone: lead.phone || '',
        whatsapp: lead.whatsapp || '',
        email: lead.email || '',
        contactPerson: lead.contactPerson || '',
        contactRole: lead.contactRole || '',
        googleMapsUrl: lead.googleMapsUrl || '',
        facebookUrl: lead.facebookUrl || '',
        instagramUrl: lead.instagramUrl || '',
        status: lead.status || 'belum_dihubungi',
        priority: lead.priority || 'medium',
        estimatedPax: lead.estimatedPax || '',
        interestedPackage: lead.interestedPackage || '',
        nextFollowUpDate: lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toISOString().split('T')[0] : '',
        notes: lead.notes || ''
      }
    } else {
      editingLead.value = null
      form.value = { ...initialForm }
    }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    editingLead.value = null
    formError.value = ''
  }

  const saveLead = async () => {
    saving.value = true
    formError.value = ''
    try {
      const payload = { ...form.value, estimatedPax: form.value.estimatedPax ? Number(form.value.estimatedPax) : null, nextFollowUpDate: form.value.nextFollowUpDate || null }
      if (editingLead.value) {
        await leadService.update(editingLead.value.id, payload)
      } else {
        await leadService.create(payload)
      }
      await fetchLeads()
      await fetchStats()
      closeModal()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal menyimpan lead'
      formError.value = msg
    } finally {
      saving.value = false
    }
  }

  const deleteLead = (lead) => {
    itemToDelete.value = lead
    confirmTitle.value = 'Hapus Lead'
    confirmMessage.value = `Apakah Anda yakin ingin menghapus "${lead.name}"? Semua catatan interaksi juga akan dihapus.`
    showConfirm.value = true
  }

  const executeDelete = async () => {
    if (!itemToDelete.value) return
    try {
      await leadService.delete(itemToDelete.value.id)
      await fetchLeads()
      await fetchStats()
    } catch (err) {
      console.error('Gagal menghapus lead:', err)
    } finally {
      showConfirm.value = false
      itemToDelete.value = null
    }
  }

  const openDrawer = (lead) => {
    selectedLead.value = lead
    showDrawer.value = true
  }

  const closeDrawer = () => {
    showDrawer.value = false
    selectedLead.value = null
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchLeads()
    }
  }

  const nextPage = () => goToPage(currentPage.value + 1)
  const prevPage = () => goToPage(currentPage.value - 1)

  const openWhatsApp = (phone) => {
    if (!phone) return
    const clean = phone.replace(/[^0-9]/g, '')
    const formatted = clean.startsWith('62') ? clean : `62${clean.startsWith('0') ? clean.slice(1) : clean}`
    window.open(`https://wa.me/${formatted}`, '_blank')
  }

  // Watchers
  let searchTimer = null
  watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      currentPage.value = 1
      fetchLeads()
    }, 400)
  })

  watch([statusFilter, categoryFilter, priorityFilter], () => {
    currentPage.value = 1
    fetchLeads()
  })

  onMounted(() => {
    fetchLeads()
    fetchStats()
    fetchFollowUps()
  })

  onUnmounted(() => {
    clearTimeout(searchTimer)
  })

  return {
    loading,
    saving,
    leads,
    stats,
    followUps,
    activeTab,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    showModal,
    showImportModal,
    showDrawer,
    selectedLead,
    editingLead,
    showConfirm,
    confirmTitle,
    confirmMessage,
    form,
    formError,
    fetchLeads,
    fetchStats,
    fetchFollowUps,
    openModal,
    closeModal,
    saveLead,
    deleteLead,
    executeDelete,
    openDrawer,
    closeDrawer,
    goToPage,
    nextPage,
    prevPage,
    openWhatsApp
  }
}
