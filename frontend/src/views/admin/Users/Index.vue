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

      <UserFormModal v-if="showModal"
        :form="form" :editing-id="editingId" :saving="saving"
        :error-message="errorMessage" :roles="roles"
        @close="closeModal" @save="saveUser"
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
import UserFormModal from './components/UserFormModal.vue'
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
