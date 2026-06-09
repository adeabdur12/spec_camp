<template>
  <DashboardLayout title="Manajemen Peran">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      
      <!-- Page Header Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Peran & Hak Akses</h2>
          <p class="text-on-surface-variant font-medium">Kelola tingkat akses sistem untuk para administrator.</p>
        </div>
        <button @click="openModal()" 
                class="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined mr-2" data-icon="key">key</span>
          Buat Peran Baru
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Role Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="roles.length === 0" class="col-span-full text-center py-12 bg-surface-container-lowest rounded-xl">
          <p class="text-on-surface-variant">Belum ada data peran. Silakan tambah data baru.</p>
        </div>

        <div v-for="role in roles" :key="role.id"
             class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative flex flex-col">

          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
              <span class="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div class="flex gap-2">
              <button v-if="!isProtected(role.name)" @click="openModal(role)" class="w-8 h-8 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center text-on-surface-variant group-hover:text-primary">
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button v-if="!isProtected(role.name)" @click="deleteRole(role.id)"
                      class="w-8 h-8 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center text-on-surface-variant group-hover:text-error">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>

          <div class="flex-1">
            <h3 class="text-base font-bold text-on-surface uppercase font-headline tracking-tight">{{ role.name }}</h3>
            <div class="flex items-center gap-2 mt-1 mb-6">
              <span class="text-[10px] font-bold text-primary uppercase tracking-widest">{{ getRoleUserCount(role) }} Pengguna</span>
              <span v-if="isProtected(role.name)" class="text-[8px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Bawaan</span>
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/10">
            <p class="text-xs font-bold text-on-surface-variant font-label uppercase tracking-widest mb-3">Tingkat Izin ({{ getRolePermissionsList(role.id).length }})</p>
            <div class="flex flex-wrap gap-1.5 h-16 overflow-y-auto pr-1">
              <span v-for="permId in getRolePermissionsList(role.id)" :key="permId" class="px-2 py-1 bg-surface-container text-on-surface-variant rounded flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider">
                <span class="w-1 h-1 rounded-full bg-primary"></span>
                {{ getPermissionName(permId) }}
              </span>
              <span v-if="getRolePermissionsList(role.id).length === 0" class="text-xs text-on-surface-variant italic font-medium">Tidak ada izin akses.</span>
            </div>
          </div>
        </div>
      </div>

      <RoleFormModal v-if="showModal"
        :form="form" :editing-id="editingId" :saving="saving"
        :error-message="errorMessage" :all-permissions="allPermissions"
        @close="closeModal" @save="saveRole"
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
import RoleFormModal from './components/RoleFormModal.vue'
import { roleService } from '../../../services/roleService'

const loading = ref(true)
const saving = ref(false)
const roles = ref([])
const allPermissions = ref([])
const rolePermissions = ref([])

const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)

const initialForm = {
  name: '',
  permissionIds: []
}

const form = ref({ ...initialForm })

const fetchData = async () => {
  loading.value = true
  try {
    const [rolesRes, permsRes, rolePermsRes] = await Promise.all([
      roleService.getAll(),
      roleService.getPermissions(),
      roleService.getRolePermissions()
    ])
    
    roles.value = rolesRes.data || rolesRes
    allPermissions.value = permsRes.data || permsRes
    rolePermissions.value = rolePermsRes.data || rolePermsRes

  } catch (err) {
    console.error('Gagal mengambil data sistem:', err)
  } finally {
    loading.value = false
  }
}

const protectedRoles = ['admin', 'user']

const isProtected = (name) => protectedRoles.includes(name)

const getRoleUserCount = (role) => {
  return role.Users ? role.Users.length : 0
}

const getRolePermissionsList = (roleId) => {
  // roleId is numeric, ensure type matches or compare as string/number safely
  return rolePermissions.value
    .filter(rp => rp.role_id === roleId || rp.roleId === roleId || rp.RoleId === roleId)
    .map(rp => rp.permission_id || rp.permissionId || rp.PermissionId)
}

const permissionLabels = {
  view_dashboard: 'Lihat Dashboard',
  view_booking: 'Lihat Pemesanan',
  create_booking: 'Buat Pemesanan',
  update_booking: 'Ubah Pemesanan',
  delete_booking: 'Hapus Pemesanan',
  view_package: 'Lihat Paket & Event',
  create_package: 'Buat Paket',
  update_package: 'Ubah Paket',
  delete_package: 'Hapus Paket',
  view_inventory: 'Lihat Inventory',
  view_service: 'Lihat Layanan',
  view_customer: 'Lihat Pelanggan',
  view_report: 'Lihat Laporan',
  manage_user: 'Kelola Pengguna',
  manage_role: 'Kelola Peran',
  manage_settings: 'Pengaturan'
}

const translatePermission = (name) => {
  return permissionLabels[name] || name.replace(/_/g, ' ')
}

const getPermissionName = (permId) => {
  const perm = allPermissions.value.find(p => p.id === permId)
  if (!perm) return 'Tidak Diketahui'
  return translatePermission(perm.name)
}

const openModal = (role = null) => {
  if (role) {
    editingId.value = role.id
    form.value = { 
      name: role.name,
      permissionIds: getRolePermissionsList(role.id)
    }
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

const saveRole = async () => {
  saving.value = true
  try {
    let savedRole
    if (editingId.value) {
      savedRole = await roleService.update(editingId.value, { name: form.value.name })
      const id = savedRole.data?.id || savedRole.id || editingId.value
      await roleService.updatePermissions(id, form.value.permissionIds)
    } else {
      savedRole = await roleService.create({ name: form.value.name })
      const id = savedRole.data?.id || savedRole.id
      if (id) {
        await roleService.updatePermissions(id, form.value.permissionIds)
      }
    }
    
    await fetchData()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan peran:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan data peran. Silakan coba lagi.'
  } finally {
    saving.value = false
  }
}

const deleteRole = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Peran'
  confirmMessage.value = 'Yakin ingin menghapus peran ini? Tindakan ini tidak dapat dibatalkan.'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await roleService.delete(itemToDelete.value)
    await fetchData()
  } catch (err) {
    console.error('Gagal menghapus peran:', err)
    // Use the modal or a toast, but for now we just log it since we removed alert
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

onMounted(fetchData)
</script>
