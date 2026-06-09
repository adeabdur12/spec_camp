<template>
  <!-- Backdrop for mobile -->
  <div v-if="isOpen" @click="$emit('close')" 
       class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in"></div>

  <aside class="fixed inset-y-0 left-0 w-72 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0 lg:flex"
         :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
    <div class="p-8">
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 flex items-center justify-center">
            <img src="/logo/logo.svg" alt="SPEC CAMP Logo" class="w-full h-full object-contain" />
          </div>
          <span class="font-black text-xl tracking-tighter font-headline">SPEC CAMP</span>
        </div>
        <button @click="$emit('close')" class="lg:hidden text-on-surface-variant hover:text-error transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav class="space-y-1">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
                     class="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all group"
                     :class="$route.path === item.path ? 'bg-primary text-on-primary shadow-xl shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'">
          <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <div class="mt-auto p-8 border-t border-outline-variant/5">
      <button @click="handleLogout" class="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-error hover:bg-error/5 w-full transition-all">
        <span class="material-symbols-outlined text-lg">logout</span>
        Keluar
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

const router = useRouter()
const route = useRoute()

const allMenuItems = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard', perm: 'view_dashboard' },
  { name: 'Pemesanan', path: '/admin/bookings', icon: 'calendar_month', perm: 'view_booking' },
  { name: 'Paket & Event', path: '/admin/paket-event', icon: 'local_activity', perm: 'view_package' },
  { name: 'Inventory', path: '/admin/inventory', icon: 'inventory_2', perm: 'view_inventory' },
  { name: 'Layanan', path: '/admin/services', icon: 'dry_cleaning', perm: 'view_service' },
  { name: 'Pelanggan', path: '/admin/customers', icon: 'badge', perm: 'view_customer' },
  { name: 'Laporan', path: '/admin/reports', icon: 'analytics', perm: 'view_report' },
  { name: 'Pengguna', path: '/admin/users', icon: 'group', perm: 'manage_user' },
  { name: 'Peran', path: '/admin/roles', icon: 'security', perm: 'manage_role' },
  { name: 'Pengaturan', path: '/admin/settings', icon: 'settings', perm: 'manage_settings' }
]

const userPermissions = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role === 'admin') return allMenuItems.map(i => i.perm)
    return user.permissions || []
  } catch { return []
  }
})

const menuItems = computed(() => {
  const perms = userPermissions.value
  if (perms.length === 0) return allMenuItems
  return allMenuItems.filter(item => perms.includes(item.perm))
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
