<template>
  <DashboardLayout title="Manajemen Pengguna">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      
      <!-- Page Header Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Akun Pengguna</h2>
          <p class="text-on-surface-variant font-medium">Kelola akun administrator, staf, dan hak aksesnya.</p>
        </div>
        <button @click="openModal()" 
                class="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined mr-2" data-icon="person_add">person_add</span>
          Tambah Pengguna
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Users Data List (Horizontal/Bento style) -->
      <div v-else class="space-y-4">
        <!-- Header Labels -->
        <div class="hidden md:grid grid-cols-12 px-6 py-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest font-label">
          <div class="col-span-5">Administrator</div>
          <div class="col-span-3">Peran Akses</div>
          <div class="col-span-3">Status</div>
          <div class="col-span-1 text-right">Aksi</div>
        </div>

        <div v-if="users.length === 0" class="text-center py-12 bg-surface-container-lowest rounded-xl">
          <p class="text-on-surface-variant">Belum ada akun terdaftar.</p>
        </div>

        <!-- User Item -->
        <div v-for="user in users" :key="user.id" 
             class="bg-surface-container-lowest p-3 md:p-5 rounded-xl group transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5">
          <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
            
            <!-- User Info -->
            <div class="col-span-12 md:col-span-5 flex items-center">
              <div class="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold shrink-0 uppercase text-lg mr-4 border border-outline-variant/10">
                {{ (user.name || 'U').substring(0, 2) }}
              </div>
              <div>
                <h4 class="font-bold text-on-surface text-base">{{ user.name }}</h4>
                <p class="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-[14px]">mail</span> {{ user.email }}
                </p>
                <p v-if="user.phone" class="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-[14px]">phone_iphone</span> {{ user.phone }}
                  <span v-if="user.notifWa" class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">WA</span>
                </p>
              </div>
            </div>

            <!-- Role -->
            <div class="col-span-6 md:col-span-3 flex flex-col justify-center">
              <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1">Peran Akses</span>
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-primary">security</span>
                <span class="text-sm font-bold text-on-surface uppercase">{{ user.Role?.name || 'Sistem' }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="col-span-6 md:col-span-3 flex items-center">
              <span class="md:hidden text-[10px] uppercase font-bold text-on-surface-variant mb-1 mr-2">Status</span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-tighter border border-emerald-200">
                <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Aktif
              </span>
            </div>

            <!-- Actions -->
            <div class="col-span-12 md:col-span-1 flex justify-end space-x-2 mt-2 md:mt-0 border-t border-outline-variant/10 pt-2 md:border-0 md:pt-0">
              <button @click="openModal(user)" class="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors group-hover:text-primary">
                <span class="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button @click="deleteUser(user.id)" class="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors group-hover:text-error">
                <span class="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- Modal User -->
      <div v-if="showModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-outline-variant/10">
          <div class="p-6 md:p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-base font-bold text-primary font-headline">
                  {{ editingId ? 'Perbarui Akun' : 'Akun Baru' }}
                </h3>
                <p class="text-sm text-on-surface-variant mt-1">Konfigurasi identitas login dan hak akses.</p>
              </div>
              <button @click="closeModal" class="text-on-surface-variant hover:text-error transition-colors p-1">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form @submit.prevent="saveUser" class="space-y-4">
              <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
                <span class="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{{ errorMessage }}</span>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Nama Pengguna *</label>
                <input v-model="form.name" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="cth: admin123">
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Alamat Email *</label>
                <input v-model="form.email" type="email" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="admin@contoh.com">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-on-surface-variant font-label">Peran Akses *</label>
                  <select v-model="form.roleId" required
                          class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                    <option value="" disabled>Pilih Peran</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
                  </select>
                </div>
                
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-on-surface-variant font-label">Kata Sandi {{ editingId ? '(Opsional)' : '*' }}</label>
                  <input v-model="form.password" type="password" :required="!editingId"
                         class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                         placeholder="••••••••">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-on-surface-variant font-label">Nomor WhatsApp</label>
                  <input v-model="form.phone" type="text"
                         class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                         placeholder="0812xxxxxx">
                </div>
                <div class="space-y-1.5 flex items-end pb-2.5">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="form.notifWa" type="checkbox" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
                    <span class="text-xs font-medium text-on-surface-variant font-label">Aktifkan Notifikasi WA</span>
                  </label>
                </div>
              </div>

              <div class="pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
                <button type="button" @click="closeModal" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button type="submit" :disabled="saving"
                        class="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
                  {{ saving ? 'Menyimpan...' : 'Simpan Akun' }}
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
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import { userService } from '../../../services/userService'
import { roleService } from '../../../services/roleService'

const loading = ref(true)
const saving = ref(false)
const users = ref([])
const roles = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const initialForm = {
  name: '',
  email: '',
  roleId: '',
  password: '',
  phone: '',
  notifWa: false
}

const form = ref({ ...initialForm })

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await userService.getAll()
    users.value = res.data || res
  } catch (err) {
    console.error('Gagal mengambil pengguna:', err)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const res = await roleService.getAll()
    roles.value = res.data || res
  } catch (err) {
    console.error('Gagal mengambil peran:', err)
  }
}

const openModal = (user = null) => {
  if (user) {
    editingId.value = user.id
    form.value = { ...user, password: '' }
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

const saveUser = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await userService.update(editingId.value, form.value)
    } else {
      await userService.create(form.value)
    }
    await fetchUsers()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan pengguna:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan pengguna. Pastikan email belum terdaftar.'
  } finally {
    saving.value = false
  }
}

const deleteUser = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Akun'
  confirmMessage.value = 'Yakin ingin menghapus akun ini secara permanen?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await userService.delete(itemToDelete.value)
    await fetchUsers()
  } catch (err) {
    console.error('Gagal menghapus pengguna:', err)
    // Silently log or use toast
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>
