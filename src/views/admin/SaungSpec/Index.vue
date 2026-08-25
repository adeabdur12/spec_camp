<template>
  <DashboardLayout title="Saung SPEC">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Menu Saung SPEC</h2>
          <p class="text-sm text-on-surface-variant font-medium">Kelola daftar menu makanan, cemilan, rebusan & minuman.</p>
        </div>
        <button @click="openModal()"
                class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Tambah Menu
        </button>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex items-center gap-2 text-sm text-on-surface-variant">
          <span class="material-symbols-outlined text-base text-primary">link</span>
          <span class="font-medium">Link Publik:</span>
        </div>
        <div class="flex-1 flex items-center gap-2 bg-surface-container rounded-xl px-4 py-2 min-w-0">
          <span class="text-sm text-on-surface truncate font-mono" id="publicUrl">{{ publicUrl }}</span>
          <button @click="copyUrl" class="shrink-0 bg-primary/10 hover:bg-primary hover:text-white text-primary p-1.5 rounded-lg transition-all active:scale-95" title="Salin link">
            <span class="material-symbols-outlined text-base">{{ copied ? 'check' : 'content_copy' }}</span>
          </button>
        </div>
        <a :href="publicUrl" target="_blank" rel="noopener noreferrer"
           class="shrink-0 bg-surface-container hover:bg-primary hover:text-white text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 justify-center">
          <span class="material-symbols-outlined text-[14px]">open_in_new</span> Buka
        </a>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="items.length === 0" class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">restaurant</span>
        <p class="text-on-surface-variant text-sm mb-4">Belum ada menu. Tambah menu baru untuk memulai.</p>
        <button @click="openModal()" class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm shadow-primary/20 inline-flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          Tambah Menu
        </button>
      </div>

      <div v-else>
        <div v-for="cat in categories" :key="cat.value" class="mb-8 last:mb-0">
          <h3 class="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-base">{{ cat.icon }}</span>
            {{ cat.label }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div v-for="item in getByCategory(cat.value)" :key="item.id"
                 class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden">
              <div class="p-5 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-3">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg', cat.bgClass]">
                    {{ cat.emoji }}
                  </div>
                  <button @click="toggleActive(item)"
                          class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                          :class="item.isActive ? 'bg-primary' : 'bg-outline-variant/40'">
                    <span class="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform"
                          :class="item.isActive ? 'translate-x-[18px]' : 'translate-x-[3px]'"></span>
                  </button>
                </div>

                <h4 class="text-base font-bold text-on-surface leading-tight mb-1">{{ item.name }}</h4>
                <p class="text-xs text-on-surface-variant line-clamp-2 mb-4 flex-1">{{ item.description || 'Tidak ada deskripsi' }}</p>

                <div class="pt-3 border-t border-outline-variant/5">
                  <p class="text-base font-bold text-primary">{{ formatCurrency(item.price) }}</p>
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
        </div>
      </div>

      <SaungSpecFormModal v-if="showModal"
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
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import SaungSpecFormModal from './components/SaungSpecFormModal.vue'
import { saungSpecMenuService } from '../../../services/saungSpecMenuService'

const publicUrl = `${window.location.origin}/menu`
const copied = ref(false)

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(publicUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const el = document.getElementById('publicUrl')
    if (el) {
      const range = document.createRange()
      range.selectNodeContents(el)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    }
  }
}

const loading = ref(true)
const saving = ref(false)
const items = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const categories = [
  { value: 'makanan', label: 'Makanan', icon: 'restaurant', emoji: '🍽️', bgClass: 'bg-amber-100 text-amber-700' },
  { value: 'cemilan', label: 'Cemilan', icon: 'cookie', emoji: '🍪', bgClass: 'bg-orange-100 text-orange-700' },
  { value: 'rebusan', label: 'Rebusan', icon: 'soup_kitchen', emoji: '🫕', bgClass: 'bg-green-100 text-green-700' },
  { value: 'minuman', label: 'Minuman', icon: 'local_cafe', emoji: '☕', bgClass: 'bg-blue-100 text-blue-700' }
]

const initialForm = {
  name: '',
  description: '',
  price: 0,
  category: 'makanan',
  imageUrl: '',
  sortOrder: 0,
  isActive: true
}

const form = ref({ ...initialForm })

const getByCategory = (cat) => items.value.filter(i => i.category === cat)

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await saungSpecMenuService.getAll()
  } catch (err) {
    console.error('Gagal mengambil menu:', err)
  } finally {
    loading.value = false
  }
}

const toggleActive = async (item) => {
  try {
    await saungSpecMenuService.update(item.id, { isActive: !item.isActive })
    item.isActive = !item.isActive
  } catch (err) {
    console.error('Gagal mengubah status:', err)
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
      await saungSpecMenuService.update(editingId.value, form.value)
    } else {
      await saungSpecMenuService.create(form.value)
    }
    await fetchItems()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan menu:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan menu.'
  } finally {
    saving.value = false
  }
}

const deleteItem = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Menu'
  confirmMessage.value = 'Yakin ingin menghapus menu ini?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  try {
    await saungSpecMenuService.delete(itemToDelete.value)
    await fetchItems()
  } catch (err) {
    console.error('Gagal menghapus menu:', err)
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

onMounted(fetchItems)
</script>
