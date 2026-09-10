<template>
  <DashboardLayout title="Affiliator" subtitle="DAFTAR AFFILIATOR & KOMISI">
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Affiliator & Komisi</h2>
          <p class="text-sm text-on-surface-variant font-medium">Kelola affiliator, link booking, dan komisi referral</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/affiliate" target="_blank" class="bg-surface-container-low text-on-surface-variant px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">open_in_new</span>
            Halaman Program Affiliate
          </a>
          <button @click="openModal()"
                  class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm shadow-primary/20 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">person_add</span>
            Tambah Affiliator
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="referrers.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
          <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Affiliator</span>
          <div class="text-2xl font-bold text-primary">{{ referrers.length }}</div>
        </div>
        <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
          <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Booking Referral</span>
          <div class="text-2xl font-bold text-on-surface">{{ totalBookingsRef }}</div>
        </div>
        <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
          <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Komisi (Semua)</span>
          <div class="text-2xl font-bold text-emerald-700">{{ formatCurrency(totalKomisi) }}</div>
          <div class="text-xs text-on-surface-variant font-medium">{{ totalBookingsRef }} booking</div>
        </div>
        <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
          <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Komisi Selesai</span>
          <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(totalKomisiSelesai) }}</div>
          <div class="text-xs text-on-surface-variant font-medium">Booking berstatus Selesai</div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="referrers.length === 0" class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">group</span>
        <p class="text-on-surface-variant text-sm mb-4">Belum ada affiliator. Tambahkan affiliator untuk mulai program referral.</p>
        <button @click="openModal()" class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 inline-flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">person_add</span>
          Tambah Affiliator
        </button>
      </div>

      <!-- List -->
      <div v-else class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-outline-variant/10">
          <h4 class="text-base font-bold text-on-surface font-headline">Daftar Affiliator</h4>
        </div>
        <div class="divide-y divide-outline-variant/5">
          <div v-for="ref in referrers" :key="ref.id" class="p-5">
            <div class="flex flex-col lg:flex-row lg:items-center gap-4">
              <!-- Info -->
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {{ getInitials(ref.name) }}
                </div>
                <div class="min-w-0">
                  <router-link :to="`/admin/referrals/${ref.id}`" class="text-sm font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-1.5">
                    {{ ref.name }}
                    <span class="material-symbols-outlined text-[14px] text-on-surface-variant/40">open_in_new</span>
                  </router-link>
                  <p class="text-[10px] text-on-surface-variant">{{ ref.phone || '-' }}</p>
                  <div class="mt-1 flex items-center gap-1.5">
                    <span class="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{{ ref.code }}</span>
                    <span class="text-[9px] text-on-surface-variant">{{ ref.summary?.totalBookings || 0 }} booking</span>
                  </div>
                </div>
              </div>

              <!-- Link -->
              <div class="flex-1 min-w-0">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Link Booking Khusus</p>
                <div class="flex items-center gap-2">
                  <input readonly :value="affiliateLink(ref)" @click="$event.target.select()"
                         class="flex-1 min-w-0 bg-surface-container px-3 py-2 rounded-lg text-[10px] font-medium text-primary truncate border-none focus:ring-2 focus:ring-primary/20" />
                  <button @click="copyLink(ref)" class="shrink-0 bg-primary/10 text-primary px-3 py-2 rounded-lg text-[10px] font-bold hover:bg-primary/20 transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">{{ copiedId === ref.id ? 'check' : 'content_copy' }}</span>
                    {{ copiedId === ref.id ? 'Tersalin' : 'Salin' }}
                  </button>
                </div>
              </div>

              <!-- Commission -->
              <div class="grid grid-cols-3 gap-4 lg:w-56 shrink-0">
                <div>
                  <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Komisi Total</p>
                  <p class="text-sm font-black text-emerald-700">{{ formatCurrency(ref.summary?.total) }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Mimount</p>
                  <p class="text-xs font-bold text-blue-600">{{ formatCurrency(ref.summary?.totalMimount) }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Spec Camp</p>
                  <p class="text-xs font-bold text-emerald-600">{{ formatCurrency(ref.summary?.totalSpecCamp) }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 shrink-0">
                <router-link :to="`/admin/referrals/${ref.id}`"
                             class="bg-primary text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[14px]">monitoring</span>
                  Dashboard
                </router-link>
                <button @click="openModal(ref)" class="bg-surface-container-low hover:bg-primary hover:text-white py-2 px-3 rounded-xl transition-colors font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">edit</span>
                </button>
                <button @click="deleteReferrer(ref.id)" class="bg-surface-container-low hover:bg-error hover:text-white py-2 px-3 rounded-xl transition-colors font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 text-error">
                  <span class="material-symbols-outlined text-[14px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referrer Modal -->
      <div v-if="showModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-base font-bold text-primary font-headline">{{ editingId ? 'Perbarui Affiliator' : 'Tambah Affiliator' }}</h3>
                <p class="text-sm text-on-surface-variant mt-1">Data affiliator program referral</p>
              </div>
              <button @click="closeModal" class="text-on-surface-variant hover:text-error transition-colors p-1">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form @submit.prevent="saveReferrer" class="space-y-4">
              <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
                <span class="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{{ errorMessage }}</span>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Nama Affiliator *</label>
                <input v-model="form.name" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="cth: Disclosure">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">No. Handphone / WA</label>
                <input v-model="form.phone" type="text"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="0812...">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Kode Link (opsional)</label>
                <input v-model="form.code" type="text" :disabled="!!editingId"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body disabled:opacity-50"
                       placeholder="Kosongkan untuk otomatis">
                <p class="text-[10px] text-on-surface-variant">Kode dipakai di link booking: <span class="font-bold">/booking?ref={{ form.code || 'kode' }}</span></p>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Catatan</label>
                <textarea v-model="form.notes" rows="2"
                          class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body resize-none"
                          placeholder="Catatan internal..."></textarea>
              </div>
              <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button type="button" @click="closeModal" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">Batal</button>
                <button type="submit" :disabled="saving"
                        class="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
                  {{ saving ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ConfirmModal
        :show="showConfirm"
        title="Hapus Affiliator"
        :message="'Yakin ingin menghapus affiliator ini? Booking yang terhubung tidak akan dihapus, hanya komisi yang dilepas.'"
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
import { referrerService } from '../../../services/referrerService'

const loading = ref(true)
const saving = ref(false)
const referrers = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')
const showConfirm = ref(false)
const itemToDelete = ref(null)
const copiedId = ref(null)

const initialForm = { name: '', phone: '', notes: '', code: '' }
const form = ref({ ...initialForm })

const totalBookingsRef = computed(() => referrers.value.reduce((sum, r) => sum + (r.summary?.totalBookings || 0), 0))
const totalKomisi = computed(() => referrers.value.reduce((sum, r) => sum + (r.summary?.total || 0), 0))
const totalKomisiSelesai = computed(() => referrers.value.reduce((sum, r) => sum + (r.summary?.completedTotal || 0), 0))

const fetchReferrers = async () => {
  loading.value = true
  try {
    const res = await referrerService.getAll({ includeBookings: true })
    referrers.value = res.data || []
  } catch (err) {
    console.error('Gagal mengambil data affiliator:', err)
  } finally {
    loading.value = false
  }
}

const affiliateLink = (ref) => {
  return `https://speccamp.site/booking?ref=${ref.code || ref.id}`
}

const copyLink = async (ref) => {
  const url = affiliateLink(ref)
  try {
    await navigator.clipboard.writeText(url)
    copiedId.value = ref.id
    setTimeout(() => { copiedId.value = null }, 2000)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copiedId.value = ref.id
    setTimeout(() => { copiedId.value = null }, 2000)
  }
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const openModal = (ref = null) => {
  if (ref) {
    editingId.value = ref.id
    form.value = { name: ref.name || '', phone: ref.phone || '', notes: ref.notes || '', code: ref.code || '' }
  } else {
    editingId.value = null
    form.value = JSON.parse(JSON.stringify(initialForm))
  }
  errorMessage.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  errorMessage.value = ''
}

const saveReferrer = async () => {
  saving.value = true
  errorMessage.value = ''
  try {
    const payload = { ...form.value }
    if (editingId.value) {
      await referrerService.update(editingId.value, payload)
    } else {
      await referrerService.create(payload)
    }
    await fetchReferrers()
    closeModal()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan affiliator.'
  } finally {
    saving.value = false
  }
}

const deleteReferrer = (id) => {
  itemToDelete.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  try {
    await referrerService.delete(itemToDelete.value)
    await fetchReferrers()
  } catch (err) {
    console.error('Gagal menghapus affiliator:', err)
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0)
}

onMounted(() => {
  fetchReferrers()
})
</script>