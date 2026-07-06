<template>
  <DashboardLayout title="Inventory">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Inventory Mimount</h2>
          <p class="text-sm text-on-surface-variant font-medium">Kelola peralatan, harga sewa, dan stok.</p>
        </div>
        <button @click="openModal()"
                class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Tambah Alat
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Alat</span>
            <div class="text-2xl font-bold text-primary">{{ stats.totalItems }}</div>
            <div class="text-emerald-700 text-xs font-bold">{{ stats.availableItems }} Tersedia</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Stok Menipis</span>
            <div class="text-2xl font-bold text-error">{{ stats.lowStock }}</div>
            <div class="text-error text-xs font-bold">Perlu restock</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Alat Aktif</span>
            <div class="text-2xl font-bold text-primary">{{ stats.activeItems }}</div>
            <div class="text-emerald-700 text-xs font-bold">{{ stats.utilizationRate }}% utilisasi</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Nilai</span>
            <div class="text-2xl font-bold text-primary">{{ formatCurrency(stats.totalValue) }}</div>
            <div class="text-emerald-700 text-xs font-bold">Nilai inventaris</div>
          </div>
        </div>

        <!-- View Toggle & Search -->
        <div class="flex items-center justify-between">
          <div class="bg-surface-container-lowest rounded-xl p-1 border border-outline-variant/10 inline-flex">
            <button @click="viewMode = 'card'" :class="viewMode === 'card' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'" class="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">grid_view</span>
              Kartu
            </button>
            <button @click="viewMode = 'table'" :class="viewMode === 'table' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'" class="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">table_rows</span>
              Tabel
            </button>
          </div>
          <p class="text-sm text-on-surface-variant font-medium">{{ items.length }} alat ditemukan</p>
        </div>

        <!-- Card View -->
        <div v-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <div v-for="item in items" :key="item.id"
               class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden relative">

            <div class="relative h-40 bg-surface-container/50 border-b border-outline-variant/10 flex items-center justify-center overflow-hidden">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <span v-else class="material-symbols-outlined text-4xl text-on-surface-variant/30">inventory_2</span>

              <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
                <span :class="getStockBadgeClass(item)" class="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {{ getStockLabel(item) }}
                </span>
                <span v-if="!item.isAvailable" class="text-[9px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-1 rounded shadow-sm">
                  Tidak Tersedia
                </span>
              </div>
            </div>

            <div class="p-3 flex flex-col flex-1">
              <div class="mb-3">
                <p class="text-[10px] font-bold text-primary uppercase tracking-wider">{{ item.categoryId || 'Umum' }}</p>
                <h3 class="text-base font-bold text-on-surface leading-tight mt-0.5">{{ item.name }}</h3>
                <p class="text-xs text-on-surface-variant line-clamp-1 mt-1">{{ item.description || 'Tidak ada deskripsi' }}</p>
              </div>

              <div class="flex items-end justify-between mt-auto pt-3 border-t border-outline-variant/5">
                <div>
                  <p class="text-[10px] font-medium text-on-surface-variant mb-0.5 uppercase tracking-wider">Harga Sewa</p>
                  <p class="text-sm font-black text-primary">{{ formatCurrency(item.price) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-medium text-on-surface-variant mb-0.5 uppercase tracking-wider">Stok</p>
                  <p class="text-base font-black text-on-surface">{{ item.stock }} <span class="text-[10px] font-bold">{{ item.unit }}</span></p>
                </div>
              </div>
            </div>

            <div class="p-3 bg-surface-container/30 border-t border-outline-variant/5 flex gap-2">
              <button @click="openModal(item)" class="flex-1 bg-surface-container-low hover:bg-primary hover:text-white py-2 rounded-xl transition-colors font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-[14px]">edit</span> Ubah
              </button>
              <button @click="deleteItem(item.id)" class="flex-1 bg-surface-container-low hover:bg-error hover:text-white py-2 rounded-xl transition-colors font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 text-error">
                <span class="material-symbols-outlined text-[14px]">delete</span> Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Table / List View -->
        <div v-if="viewMode === 'table'" class="space-y-4">
          <div class="hidden md:grid grid-cols-12 px-6 py-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest">
            <div class="col-span-5">Detail Alat</div>
            <div class="col-span-2 text-center">Level Stok</div>
            <div class="col-span-2 text-center">Harga / Hari</div>
            <div class="col-span-2 text-center">Status</div>
            <div class="col-span-1 text-right">Aksi</div>
          </div>

          <div v-for="item in items" :key="item.id"
               class="bg-surface-container-lowest p-3 md:p-5 rounded-xl group transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5 border border-outline-variant/10">
            <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
              <div class="col-span-12 md:col-span-5 flex items-center">
                <div class="w-16 h-16 rounded-lg bg-surface-container-high overflow-hidden mr-4 shrink-0">
                  <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover">
                  <span v-else class="w-full h-full flex items-center justify-center material-symbols-outlined text-2xl text-on-surface-variant/30">inventory_2</span>
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-primary text-base truncate">{{ item.name }}</h4>
                  <div class="flex gap-2 mt-1 flex-wrap">
                    <span class="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{{ item.categoryId || 'Umum' }}</span>
                    <span v-if="!item.isAvailable" class="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Tidak Aktif</span>
                  </div>
                </div>
              </div>

              <div class="col-span-6 md:col-span-2 flex flex-col items-center">
                <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1">Stok</span>
                <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden max-w-[80px]">
                  <div :class="getStockBarClass(item)" class="h-full rounded-full" :style="{ width: getStockPercent(item) + '%' }"></div>
                </div>
                <span :class="item.stock < 5 ? 'text-error' : 'text-on-surface'" class="text-sm font-bold mt-1">{{ item.stock }} / {{ Math.max(item.stock, 20) }}</span>
              </div>

              <div class="col-span-6 md:col-span-2 flex flex-col items-center">
                <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1">Harga</span>
                <span class="text-base font-bold text-primary">{{ formatCurrency(item.price) }}</span>
              </div>

              <div class="col-span-6 md:col-span-2 flex justify-center">
                <span :class="getStatusBadgeClass(item)" class="px-3 py-1 rounded-full text-xs font-bold border">{{ getStatusLabel(item) }}</span>
              </div>

              <div class="col-span-6 md:col-span-1 flex justify-end gap-2">
                <button @click="openModal(item)" class="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors group-hover:text-primary">
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button @click="deleteItem(item.id)" class="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors group-hover:text-error">
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="items.length === 0" class="text-center py-12 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/30">
            <p class="text-on-surface-variant text-sm">Belum ada alat. Tambah alat baru untuk memulai.</p>
          </div>
        </div>
      </template>

      <InventoryFormModal v-if="showModal"
        :form="form" :editing-id="editingId" :saving="saving"
        :error-message="errorMessage"
        @close="closeModal" @save="saveItem"
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
import { ref, computed, watch, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import InventoryFormModal from './components/InventoryFormModal.vue'
import api from '../../../services/api'

const loading = ref(true)
const saving = ref(false)
const items = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const viewMode = ref(localStorage.getItem('inventory_view_mode') || 'card')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const initialForm = {
  name: '',
  description: '',
  price: 0,
  unit: 'unit',
  stock: 0,
  isAvailable: true,
  categoryId: 'Tenda',
  imageUrl: ''
}

const form = ref({ ...initialForm })

const stats = computed(() => {
  const all = items.value
  return {
    totalItems: all.length,
    availableItems: all.filter(i => i.isAvailable && i.stock > 0).length,
    lowStock: all.filter(i => i.stock > 0 && i.stock < 5).length,
    activeItems: all.filter(i => i.isAvailable).length,
    totalValue: all.reduce((sum, i) => sum + (Number(i.price) * Number(i.stock)), 0),
    utilizationRate: all.length ? Math.round((all.filter(i => i.isAvailable).length / all.length) * 100) : 0
  }
})

const fetchItems = async () => {
  loading.value = true
  try {
    const res = await api.get('/inventory')
    items.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal mengambil inventory:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id
    form.value = { ...item }
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

const saveItem = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await api.put(`/inventory/${editingId.value}`, form.value)
    } else {
      await api.post('/inventory', form.value)
    }
    await fetchItems()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan alat:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan alat. Periksa data Anda.'
  } finally {
    saving.value = false
  }
}

const deleteItem = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Alat'
  confirmMessage.value = 'Yakin ingin menghapus alat ini?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  try {
    await api.delete(`/inventory/${itemToDelete.value}`)
    await fetchItems()
  } catch (err) {
    console.error('Gagal menghapus alat:', err)
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

const getStockLabel = (item) => {
  if (!item.isAvailable) return 'Tidak Aktif'
  if (item.stock <= 0) return 'Habis'
  if (item.stock < 5) return 'Stok Menipis'
  return 'Tersedia'
}

const getStockBadgeClass = (item) => {
  if (!item.isAvailable || item.stock <= 0) return 'bg-surface-container text-on-surface-variant'
  if (item.stock < 5) return 'bg-error-container text-on-error-container shadow-sm'
  return 'bg-emerald-100 text-emerald-700 shadow-sm'
}

const getStatusLabel = (item) => {
  if (!item.isAvailable) return 'Tidak Aktif'
  if (item.stock <= 0) return 'Habis'
  if (item.stock < 5) return 'Stok Menipis'
  return 'Tersedia'
}

const getStatusBadgeClass = (item) => {
  if (!item.isAvailable || item.stock <= 0) return 'bg-surface-container-high text-on-surface-variant border-outline-variant/20'
  if (item.stock < 5) return 'bg-tertiary-fixed text-on-tertiary-fixed border-amber-200'
  return 'bg-emerald-100 text-emerald-800 border-emerald-200'
}

const getStockBarClass = (item) => {
  if (!item.isAvailable || item.stock <= 0) return 'bg-outline'
  if (item.stock < 5) return 'bg-error'
  return 'bg-emerald-600'
}

const getStockPercent = (item) => {
  const max = Math.max(item.stock, 20)
  return Math.min(100, (item.stock / max) * 100)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}

watch(viewMode, (val) => {
  localStorage.setItem('inventory_view_mode', val)
})

onMounted(fetchItems)
</script>
