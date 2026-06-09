<template>
  <DashboardLayout title="Layanan">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Layanan</h2>
          <p class="text-sm text-on-surface-variant font-medium">Kelola layanan tambahan untuk tamu.</p>
        </div>
        <button @click="openModal()"
                class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Tambah Layanan
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="services.length === 0" class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">dry_cleaning</span>
        <p class="text-on-surface-variant text-sm mb-4">Belum ada layanan. Tambah layanan baru untuk memulai.</p>
        <button @click="openModal()" class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm shadow-primary/20 inline-flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Tambah Layanan
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div v-for="service in services" :key="service.id"
             class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden">

          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <i v-if="service.icon" :class="'bi ' + service.icon + ' text-xl'"></i>
                <span v-else class="material-symbols-outlined text-xl">home_repair_service</span>
              </div>
              <div class="flex flex-col items-end gap-1.5">
                <span v-if="service.isActive" class="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Aktif
                </span>
                <span v-else class="bg-surface-container text-on-surface-variant text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Nonaktif
                </span>
                <span :class="service.type === 'mimount' ? 'bg-blue-100 text-blue-700' : service.type === 'eksternal' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'" class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  {{ service.type === 'mimount' ? 'Mimount' : service.type === 'eksternal' ? 'Eksternal' : 'Spec Camp' }}
                </span>
                <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider border border-outline-variant/20 px-2 py-0.5 rounded">
                  {{ service.category }}
                </span>
              </div>
            </div>

            <h3 class="text-base font-bold text-on-surface leading-tight mb-1">{{ service.name }}</h3>
            <p class="text-xs text-on-surface-variant line-clamp-2 mb-4 flex-1">{{ service.description || 'Tidak ada deskripsi' }}</p>

            <div class="pt-3 border-t border-outline-variant/5">
              <p class="text-[10px] font-medium text-on-surface-variant mb-0.5 uppercase tracking-wider">Tarif</p>
              <p class="text-base font-bold text-primary">{{ formatCurrency(service.price) }}<span class="text-xs font-medium text-on-surface-variant ml-1">/ {{ service.unit || 'orang' }}</span></p>
            </div>
          </div>

          <div class="p-3 bg-surface-container/30 border-t border-outline-variant/5 flex gap-2">
            <button @click="openModal(service)" class="flex-1 bg-surface-container-low hover:bg-primary hover:text-white py-2 rounded-xl transition-colors font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">edit</span> Ubah
            </button>
            <button @click="deleteService(service.id)" class="flex-1 bg-surface-container-low hover:bg-error hover:text-white py-2 rounded-xl transition-colors font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 text-error">
              <span class="material-symbols-outlined text-[14px]">delete</span> Hapus
            </button>
          </div>
        </div>
      </div>

      <ServiceFormModal v-if="showModal"
        :form="form" :editing-id="editingId" :saving="saving"
        :error-message="errorMessage"
        @close="closeModal" @save="saveService"
      />
      <ConfirmModal 
        :show="showConfirm" 
        :title="confirmTitle" 
        :message="confirmMessage" 
        @confirm="executeDelete" 
        @cancel="showConfirm = false" 
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import ServiceFormModal from './components/ServiceFormModal.vue'
import { serviceService } from '../../../services/serviceService'

const loading = ref(true)
const saving = ref(false)
const services = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const initialForm = {
  name: '',
  description: '',
  price: 0,
  unit: 'orang',
  type: 'spec_camp',
  category: 'other',
  isActive: true,
  isViewPublic: false
}

const form = ref({ ...initialForm })

const fetchServices = async () => {
  loading.value = true
  try {
    const data = await serviceService.getAll()
    services.value = data
  } catch (err) {
    console.error('Gagal mengambil layanan:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (service = null) => {
  if (service) {
    editingId.value = service.id
    form.value = { ...service }
  } else {
    editingId.value = null
    form.value = { ...initialForm }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  errorMessage.value = ''
}

const saveService = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await serviceService.update(editingId.value, form.value)
    } else {
      await serviceService.create(form.value)
    }
    await fetchServices()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan layanan:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan layanan.'
  } finally {
    saving.value = false
  }
}

const deleteService = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Layanan'
  confirmMessage.value = 'Yakin ingin menghapus layanan ini?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await serviceService.delete(itemToDelete.value)
    await fetchServices()
  } catch (err) {
    console.error('Gagal menghapus layanan:', err)
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}

onMounted(fetchServices)
</script>
