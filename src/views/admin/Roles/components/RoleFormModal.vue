<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-outline-variant/10 flex flex-col max-h-[90vh]">
      <div class="p-6 md:p-6 flex-shrink-0">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Peran & Akses' : 'Peran Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Konfigurasi nama peran dan otoritas modul.</p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <div class="p-6 md:p-6 pt-0 overflow-y-auto flex-1">
        <form @submit.prevent="$emit('save')" class="space-y-6">
          <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant font-label">Nama Peran *</label>
            <input v-model="form.name" type="text" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                   placeholder="cth: Supervisor">
          </div>

          <!-- Permissions Checkboxes -->
          <div class="space-y-3 pt-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-primary font-label uppercase tracking-wider">Pemetaan Hak Akses</label>
              <button type="button" @click="toggleAllPermissions" class="text-[10px] font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider">
                Pilih Semua
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-surface-container-low border border-outline-variant/10 rounded-xl">
              <div v-for="perm in allPermissions" :key="perm.id" class="flex items-start gap-2">
                <input type="checkbox" :id="'perm-'+perm.id" :value="perm.id" v-model="form.permissionIds"
                       class="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20 border-outline-variant/30">
                <label :for="'perm-'+perm.id" class="cursor-pointer flex flex-col">
                  <span class="text-sm font-bold text-on-surface capitalize">{{ translatePermission(perm.name) }}</span>
                  <span class="text-[10px] text-on-surface-variant">{{ perm.description || 'Hak akses sistem' }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Peran & Izin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  form: Object,
  editingId: [Number, String],
  saving: Boolean,
  errorMessage: String,
  allPermissions: Array
})

defineEmits(['close', 'save'])

const toggleAllPermissions = () => {
  if (props.form.permissionIds.length === props.allPermissions.length) {
    props.form.permissionIds = []
  } else {
    props.form.permissionIds = props.allPermissions.map(p => p.id)
  }
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
</script>
