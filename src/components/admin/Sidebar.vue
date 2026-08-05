<template>
  <!-- Backdrop for mobile -->
  <div v-if="isOpen" @click="$emit('close')" 
       class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in"></div>

  <aside class="fixed inset-y-0 left-0 w-72 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0 lg:flex"
         :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
    <div class="p-8 flex-shrink-0">
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
    </div>

    <nav class="flex-1 overflow-y-auto px-8 pb-4 space-y-1">
      <template v-for="item in menuItems" :key="item.path || item.group">
        <!-- Single item -->
        <router-link v-if="!item.children" :to="item.path"
                     class="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all group"
                     :class="$route.path === item.path ? 'bg-primary text-on-primary shadow-xl shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'">
          <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>

        <!-- Group with dropdown -->
        <div v-else>
          <button @click="toggleGroup(item.group)"
                  class="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all w-full text-left"
                  :class="isGroupActive(item) ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'">
            <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
            <span class="flex-1">{{ item.name }}</span>
            <span class="material-symbols-outlined text-sm transition-transform duration-200"
                  :class="openGroups[item.group] ? 'rotate-180' : ''">expand_more</span>
          </button>
          <transition name="dropdown">
            <div v-show="openGroups[item.group]" class="ml-4 mt-0.5 space-y-0.5 border-l-2 border-outline-variant/10 pl-3">
              <router-link v-for="child in item.children" :key="child.path" :to="child.path"
                           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                           :class="$route.path === child.path ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'">
                <span class="material-symbols-outlined text-base">{{ child.icon }}</span>
                {{ child.name }}
              </router-link>
            </div>
          </transition>
        </div>
      </template>
    </nav>

    <div class="flex-shrink-0 p-8 border-t border-outline-variant/5">
      <button @click="handleLogout" class="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-error hover:bg-error/5 w-full transition-all">
        <span class="material-symbols-outlined text-lg">logout</span>
        Keluar
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

const router = useRouter()
const route = useRoute()

const openGroups = ref({})

const allMenuItems = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard', perm: 'view_dashboard' },
  { name: 'Pemesanan', path: '/admin/bookings', icon: 'calendar_month', perm: 'view_booking' },
  { name: 'CRM Marketing', path: '/admin/crm', icon: 'hub', perm: 'view_lead' },
  {
    name: 'Master Data',
    group: 'master-data',
    icon: 'database',
    perm: ['view_package', 'view_inventory', 'view_service'],
    children: [
      { name: 'Paket & Event', path: '/admin/paket-event', icon: 'local_activity', perm: 'view_package' },
      { name: 'Inventory', path: '/admin/inventory', icon: 'inventory_2', perm: 'view_inventory' },
      { name: 'Layanan', path: '/admin/services', icon: 'dry_cleaning', perm: 'view_service' }
    ]
  },
  { name: 'Pelanggan', path: '/admin/customers', icon: 'badge', perm: 'view_customer' },
  { name: 'Laporan', path: '/admin/reports', icon: 'analytics', perm: 'view_report' },
    {
      name: 'Pengaturan',
      group: 'settings',
      icon: 'settings',
      perm: ['manage_user', 'manage_role', 'manage_settings'],
      children: [
        { name: 'Pengguna', path: '/admin/users', icon: 'group', perm: 'manage_user' },
        { name: 'Peran', path: '/admin/roles', icon: 'security', perm: 'manage_role' },
        { name: 'Sistem', path: '/admin/settings', icon: 'tune', perm: 'manage_settings' },
        { name: 'Chatbot AI', path: '/admin/whatsapp-bot', icon: 'chat', perm: 'manage_settings' }
      ]
    }
]

const userPermissions = computed(() => {
  route.path
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role?.toLowerCase() === 'admin') return allMenuItems.flatMap(i => i.children ? i.children.map(c => c.perm) : [i.perm])
    return user.permissions || []
  } catch { return [] }
})

const hasPermission = (perm) => {
  const perms = userPermissions.value
  if (perms.length === 0) return true
  if (Array.isArray(perm)) return perm.some(p => perms.includes(p))
  return perms.includes(perm)
}

const menuItems = computed(() => {
  return allMenuItems.filter(item => hasPermission(item.perm))
})

const toggleGroup = (group) => {
  openGroups.value[group] = !openGroups.value[group]
}

const isGroupActive = (item) => {
  return item.children?.some(child => route.path === child.path)
}

// Auto-expand active group on route change
watch(() => route.path, (path) => {
  allMenuItems.forEach(item => {
    if (item.children?.some(child => path === child.path)) {
      openGroups.value[item.group] = true
    }
  })
}, { immediate: true })

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  max-height: 0;
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
