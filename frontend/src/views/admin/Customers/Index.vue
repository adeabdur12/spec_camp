<template>
  <DashboardLayout title="Manajemen Pelanggan">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      
      <!-- Page Header Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Basis Data Pelanggan</h2>
          <p class="text-on-surface-variant font-medium">Kelola informasi identitas, kontak, dan kontak darurat tamu.</p>
        </div>
        <button @click="openModal()" 
                class="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined mr-2" data-icon="person_add">person_add</span>
          Tambah Pelanggan
        </button>
      </div>

      <!-- Dashboard Stats Tonal Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
<div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-sm font-bold uppercase tracking-widest font-label">Total Pelanggan</span>
            <div class="text-2xl font-bold text-primary">{{ customers.length }}</div>
            <div class="text-emerald-700 text-xs font-bold">Terdaftar dalam sistem</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-sm font-bold uppercase tracking-widest font-label">Data Lengkap</span>
            <div class="text-2xl font-bold text-primary">{{ completeDataCount }}</div>
            <div class="text-emerald-700 text-xs font-bold">KTP & Kontak terisi</div>
          </div>
          <div class="bg-tertiary-container text-white p-5 rounded-xl space-y-2">
          <span class="text-white/70 text-sm font-bold uppercase tracking-widest font-label">Perlu Diperbarui</span>
          <div class="text-2xl font-bold">{{ incompleteDataCount }}</div>
          <div class="text-white/90 text-xs font-bold">Identitas kosong</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Customer Data List (Bento-style list) -->
      <div v-else class="space-y-4">
        <!-- Header Labels -->
        <div class="hidden md:grid grid-cols-12 px-6 py-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest font-label">
          <div class="col-span-4">Profil Pelanggan</div>
          <div class="col-span-3">Kontak Info</div>
          <div class="col-span-2">Identitas</div>
          <div class="col-span-2">Kontak Darurat</div>
          <div class="col-span-1 text-right">Aksi</div>
        </div>

        <div v-if="customers.length === 0" class="text-center py-12 bg-surface-container-lowest rounded-xl">
          <p class="text-on-surface-variant">Belum ada pelanggan terdaftar. Silakan tambah data baru.</p>
        </div>

        <!-- Customer Item -->
        <div v-for="customer in customers" :key="customer.id" 
             class="bg-surface-container-lowest p-3 md:p-5 rounded-xl group transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5">
          <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-2">
            
            <!-- Customer Info -->
            <div class="col-span-12 md:col-span-4 flex items-center">
              <div class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold shrink-0 uppercase text-lg mr-4">
                {{ getInitials(customer.name) }}
              </div>
              <div>
                <h4 class="font-bold text-primary text-base">{{ customer.name }}</h4>
                <div class="flex items-center gap-1 mt-1 text-[11px] text-on-surface-variant font-medium">
                  <span class="material-symbols-outlined text-[14px]">home_pin</span>
                  <span class="line-clamp-1">{{ customer.address || 'Alamat tidak tersedia' }}</span>
                </div>
              </div>
            </div>

            <!-- Contact -->
            <div class="col-span-6 md:col-span-3 flex flex-col justify-center space-y-1">
              <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1">Kontak</span>
              <p class="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-on-surface-variant">phone_iphone</span>
                {{ customer.phone || '-' }}
              </p>
              <p class="text-xs text-on-surface-variant flex items-center gap-1.5 line-clamp-1">
                <span class="material-symbols-outlined text-[14px]">phone_iphone</span>
                {{ customer.phone || '-' }}
              </p>
            </div>

            <!-- Identity -->
            <div class="col-span-6 md:col-span-2 flex flex-col justify-center">
              <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1">Identitas</span>
              <span class="text-xs font-bold text-primary uppercase tracking-widest">{{ customer.idCardType || 'ktp' }}</span>
              <span class="text-xs font-medium text-on-surface">{{ customer.idCard || 'Tidak diisi' }}</span>
            </div>

            <!-- Emergency -->
            <div class="col-span-6 md:col-span-2 flex flex-col justify-center">
              <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1">Darurat</span>
              <div v-if="customer.emergencyContact" class="flex flex-col">
                <span class="text-xs font-bold text-tertiary-container line-clamp-1">{{ customer.emergencyContact }}</span>
                <span class="text-[11px] font-bold text-on-surface flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">phone</span> {{ customer.emergencyPhone || '-' }}
                </span>
              </div>
              <span v-else class="text-xs text-on-surface-variant/50 font-medium italic">Tidak ada kontak</span>
            </div>

            <!-- Actions -->
            <div class="col-span-6 md:col-span-1 flex justify-end space-x-2 mt-2 md:mt-0">
              <button @click="openModal(customer)" class="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors group-hover:text-primary">
                <span class="material-symbols-outlined text-[20px]" data-icon="edit">edit</span>
              </button>
              <button @click="deleteCustomer(customer.id)" class="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors group-hover:text-error">
                <span class="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Pelanggan -->
      <div v-if="showModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
          <div class="p-6 md:p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-base font-bold text-primary font-headline">
                  {{ editingId ? 'Perbarui Data Pelanggan' : 'Pelanggan Baru' }}
                </h3>
                <p class="text-sm text-on-surface-variant mt-1">Lengkapi informasi dasar dan kontak darurat tamu.</p>
              </div>
              <button @click="closeModal" class="text-on-surface-variant hover:text-error transition-colors p-1">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form @submit.prevent="saveCustomer" class="space-y-5">
              <!-- Basic Info -->
              <div>
                <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3 font-label">Informasi Dasar</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">Nama Lengkap *</label>
                    <input v-model="form.name" type="text" required
                           class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                           placeholder="Sesuai kartu identitas">
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">No. Telepon / WA *</label>
                    <input v-model="form.phone" type="text" required
                           class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                           placeholder="0812...">
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">Tanggal Lahir</label>
                    <input v-model="form.dateOfBirth" type="date"
                           class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                  </div>
                </div>
              </div>

              <!-- Identity Details -->
              <div class="border-t border-outline-variant/10 pt-4">
                <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3 font-label">Detail Identitas</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">Jenis ID</label>
                    <select v-model="form.idCardType"
                            class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body uppercase">
                      <option value="ktp">KTP</option>
                      <option value="sim">SIM</option>
                      <option value="passport">PASPOR</option>
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">Nomor ID</label>
                    <input v-model="form.idCard" type="text"
                           class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                           placeholder="Nomor identitas...">
                  </div>
                </div>
                <div class="space-y-1.5 mt-4">
                  <label class="text-xs font-medium text-on-surface-variant font-label">Alamat Lengkap</label>
                  <textarea v-model="form.address" rows="2"
                         class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body resize-none"
                         placeholder="Tuliskan alamat sesuai KTP..."></textarea>
                </div>
              </div>

              <!-- Emergency Contact -->
              <div class="border-t border-outline-variant/10 pt-4 bg-error-container/20 -mx-6 md:-mx-8 px-6 md:px-8 py-4">
                <h4 class="text-xs font-bold text-tertiary-container uppercase tracking-wider mb-3 font-label">Kontak Darurat</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">Nama Kontak Darurat</label>
                    <input v-model="form.emergencyContact" type="text"
                           class="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 text-sm font-body"
                           placeholder="Nama Wali/Kerabat">
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-on-surface-variant font-label">No. Telepon Darurat</label>
                    <input v-model="form.emergencyPhone" type="text"
                           class="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 text-sm font-body"
                           placeholder="0813...">
                  </div>
                </div>
              </div>

              <!-- Extra Notes -->
              <div class="space-y-1.5 pt-2">
                <label class="text-xs font-medium text-on-surface-variant font-label">Catatan Tambahan</label>
                <textarea v-model="form.notes" rows="2"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body resize-none"
                       placeholder="Catat kondisi medis, pantangan makanan, atau permintaan khusus..."></textarea>
              </div>

              <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button type="button" @click="closeModal" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button type="submit" :disabled="saving"
                        class="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
                  {{ saving ? 'Menyimpan...' : 'Simpan Data Pelanggan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import { customerService } from '../../../services/customerService'

const loading = ref(true)
const saving = ref(false)
const customers = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const initialForm = {
  name: '',
  phone: '',
  idCardType: 'ktp',
  idCard: '',
  dateOfBirth: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  notes: ''
}

const form = ref({ ...initialForm })

// Computed Data Metrics
const completeDataCount = computed(() => {
  return customers.value.filter(c => c.idCard && c.emergencyPhone && c.address).length
})

const incompleteDataCount = computed(() => {
  return customers.value.length - completeDataCount.value
})

const fetchCustomers = async () => {
  loading.value = true
  try {
    const res = await customerService.getAll()
    // Fixing wrapper extraction based on backend model return {success, data}
    customers.value = res.data || res 
  } catch (err) {
    console.error('Gagal mengambil pelanggan:', err)
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('')
}

const openModal = (customer = null) => {
  if (customer) {
    editingId.value = customer.id
    form.value = { ...customer }
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

const saveCustomer = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await customerService.update(editingId.value, form.value)
    } else {
      await customerService.create(form.value)
    }
    await fetchCustomers()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan pelanggan:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan data.'
  } finally {
    saving.value = false
  }
}

const deleteCustomer = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Pelanggan'
  confirmMessage.value = 'Yakin ingin menghapus data pelanggan ini secara permanen?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await customerService.delete(itemToDelete.value)
    await fetchCustomers()
  } catch (err) {
    console.error('Gagal menghapus pelanggan:', err)
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

onMounted(fetchCustomers)
</script>
