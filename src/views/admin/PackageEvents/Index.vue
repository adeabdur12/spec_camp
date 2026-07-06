<template>
  <DashboardLayout title="Paket">
    <div class="space-y-6">
      <!-- Header with Action -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Paket & Event</h2>
          <p class="text-sm text-on-surface-variant font-medium">Buat paket, atur harga, dan tentukan bagi hasil.</p>
        </div>
        <div class="flex items-center gap-3">
          <router-link to="/admin/services" 
                  class="bg-surface-container text-on-surface px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-surface-container-high transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">settings_suggest</span>
            Kelola Master Layanan
          </router-link>
          <button @click="openModal()" 
                  class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm shadow-primary/20 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">add_circle</span>
            Buat Paket
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="packages.length === 0" class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">event</span>
        <p class="text-on-surface-variant text-sm mb-4">Belum ada paket. Buat paket baru untuk memulai.</p>
        <button @click="openModal()" class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm shadow-primary/20 inline-flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Buat Paket
        </button>
      </div>

      <!-- Grid Display -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="pkg in packages" :key="pkg.id" 
             class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
          
          <div v-if="pkg.isFeatured" class="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-10 shadow-sm">
            Unggulan
          </div>

          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                {{ pkg.category || 'Umum' }}
              </span>
              <span v-if="pkg.badgeText" class="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                {{ pkg.badgeText }}
              </span>
            </div>

            <h3 class="text-base font-bold text-on-surface leading-tight mb-2">{{ pkg.name }}</h3>
            
            <p class="text-xs text-on-surface-variant line-clamp-2 mb-4">
              {{ pkg.description || 'Tidak ada deskripsi.' }}
            </p>

            <div v-if="pkg.features?.length" class="flex flex-wrap gap-1.5 mb-4">
              <span v-for="(f, i) in pkg.features" :key="i"
                    class="text-[9px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">
                {{ typeof f === 'string' ? f : f.text || f }}
              </span>
            </div>

            <div v-if="pkg.perPerson" class="text-[10px] text-on-surface-variant mb-4 flex items-start gap-1">
              <span class="material-symbols-outlined text-[14px] mt-0.5">person</span>
              <span>{{ pkg.perPerson }}</span>
            </div>

            <div class="mt-auto grid grid-cols-2 gap-y-3 gap-x-4 mb-4 border-t border-outline-variant/5 pt-3">
              <div>
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Batas Pax</p>
                <p class="text-xs font-medium text-on-surface">{{ pkg.minPax || 1 }} - {{ pkg.maxPax || 100 }} Orang</p>
              </div>
              <div v-if="pkg.dayType">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Tipe Hari</p>
                <p class="text-xs font-medium text-on-surface capitalize">{{ pkg.dayType }}</p>
              </div>
              
              <div v-if="pkg.mimountShare" class="col-span-2 space-y-1">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Bagi Hasil</p>
                <div class="flex flex-wrap gap-1">
                  <span class="text-[9px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                    Mimount: {{ formatCurrency(pkg.mimountShare) }}/pax
                  </span>
                  <span class="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    Spec Camp: {{ formatCurrency(pkg.pricePerPax - pkg.mimountShare) }}/pax
                  </span>
                </div>
              </div>
            </div>

            <div class="border-t border-outline-variant/5 pt-3">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Harga Per Pax</p>
              <p class="text-base font-black text-primary">{{ formatCurrency(pkg.pricePerPax) }}</p>
            </div>
          </div>

          <div class="p-3 bg-surface-container/30 border-t border-outline-variant/5 flex gap-2">
            <button @click="openModal(pkg)" class="flex-1 bg-surface-container-low hover:bg-primary hover:text-white py-2 rounded-xl transition-colors font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">edit</span> Ubah
            </button>
            <button @click="deletePackage(pkg.id)" class="flex-1 bg-surface-container-low hover:bg-error hover:text-white py-2 rounded-xl transition-colors font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 text-error">
              <span class="material-symbols-outlined text-[14px]">delete</span> Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Package Modal -->
      <PackageFormModal v-if="showModal"
        :form="form" :editing-id="editingId" :saving="saving"
        :error-message="errorMessage" :revenue-preview="revenuePreview"
        @close="closeModal" @save="savePackage"
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
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import { packageService } from '../../../services/packageService'
import PackageFormModal from './components/PackageFormModal.vue'

const loading = ref(true)
const saving = ref(false)
const packages = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const revenuePreview = computed(() => {
  const price = Number(form.value.pricePerPax) || 0
  const mimountShare = Number(form.value.mimountShare) || 0
  const grossShare = Math.max(0, price - mimountShare)
  const tax = Math.round(grossShare * 0.1)
  const localFee = Math.round(grossShare * 0.05)
  const specCampNet = Math.max(0, grossShare - tax - localFee)
  return {
    basePrice: price,
    mimountShare,
    specCampShare: grossShare,
    tax,
    localFee,
    specCampNet
  }
})

const initialForm = {
  name: '',
  description: '',
  category: 'area',
  pricePerPax: 0,
  mimountShare: 0,
  minPax: 1,
  maxPax: 100,
  areaType: '',
  dayType: '',
  packageType: '',
  isActive: true,
  isFeatured: false,
  badgeText: '',
  features: [],
  perPerson: ''
}

const form = ref({ ...initialForm })

const fetchPackages = async () => {
  loading.value = true
  try {
    const data = await packageService.getAll()
    packages.value = data
  } catch (err) {
    console.error('Failed to fetch packages:', err)
  } finally {
    loading.value = false
  }
}

const normalizeFeatures = (features) => {
  if (!Array.isArray(features)) return []
  return features.map(f => typeof f === 'string' ? f : f.text || f)
}

const openModal = (pkg = null) => {
  if (pkg) {
    editingId.value = pkg.id
    form.value = { 
      ...pkg, 
      features: normalizeFeatures(pkg.features),
      packageType: pkg.packageType || '',
      dayType: pkg.dayType || ''
    }
  } else {
    editingId.value = null
    form.value = JSON.parse(JSON.stringify(initialForm))
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  errorMessage.value = ''
}

const savePackage = async () => {
  saving.value = true
  try {
    const payload = { 
      ...form.value,
      dayType: form.value.dayType || null,
      packageType: form.value.packageType || null
    }

    if (editingId.value) {
      await packageService.update(editingId.value, payload)
    } else {
      await packageService.create(payload)
    }
    await fetchPackages()
    closeModal()
  } catch (err) {
    console.error('Failed to save package:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan paket.'
  } finally {
    saving.value = false
  }
}

const deletePackage = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Paket'
  confirmMessage.value = 'Yakin ingin menghapus paket ini?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    await packageService.delete(itemToDelete.value)
    await fetchPackages()
  } catch (err) {
    console.error('Failed to delete package:', err)
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

onMounted(() => {
  fetchPackages()
})
</script>
