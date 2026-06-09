<template>
  <nav class="fixed bottom-0 inset-x-0 bg-surface-container-lowest/80 backdrop-blur-lg border-t border-outline-variant/10 px-6 py-3 flex items-center justify-between z-[60] lg:hidden safe-area-bottom">
    <router-link v-for="item in mobileMenu" :key="item.path" :to="item.path"
                 class="flex flex-col items-center gap-1 transition-all"
                 :class="$route.path === item.path ? 'text-primary' : 'text-on-surface-variant'">
      <span class="material-symbols-outlined text-2xl" :class="{ 'fill-1': $route.path === item.path }">
        {{ item.icon }}
      </span>
      <span class="text-[9px] font-black uppercase tracking-tighter">{{ item.name }}</span>
    </router-link>
    
    <!-- More Menu Toggle (Optional if needed) -->
    <button @click="$emit('toggle-sidebar')" class="flex flex-col items-center gap-1 text-on-surface-variant">
      <span class="material-symbols-outlined text-2xl">menu</span>
      <span class="text-[9px] font-black uppercase tracking-tighter">Menu</span>
    </button>
  </nav>
</template>

<script setup>
defineEmits(['toggle-sidebar'])

const mobileMenu = [
  { name: 'Beranda', path: '/admin', icon: 'dashboard' },
  { name: 'Pesanan', path: '/admin/bookings', icon: 'calendar_month' },
  { name: 'Paket', path: '/admin/paket-event', icon: 'local_activity' },
  { name: 'Laporan', path: '/admin/reports', icon: 'analytics' }
]
</script>

<style scoped>
.fill-1 {
  font-variation-settings: 'FILL' 1;
}
.safe-area-bottom {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}
</style>
