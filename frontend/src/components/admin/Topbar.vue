<template>
  <header class="h-16 md:h-24 bg-surface/80 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between border-b border-outline-variant/5">
    <div class="flex items-center gap-3 md:gap-4">
      <button @click="$emit('toggle-sidebar')" class="lg:hidden w-9 h-9 flex items-center justify-center bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-all">
        <span class="material-symbols-outlined text-xl">menu</span>
      </button>
      <div class="flex items-center gap-2 md:gap-4">
        <div class="lg:hidden w-8 h-8 flex items-center justify-center">
          <img src="/logo/logo.svg" alt="Logo" class="w-full h-full object-contain" />
        </div>
        <div>
          <p class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary leading-none mb-1">{{ title }}</p>
          <h1 class="text-base md:text-xl font-black text-on-surface font-headline tracking-tight leading-none">{{ subtitle }}</h1>
        </div>
      </div>
    </div>

    <div class="relative group">
      <button @click="showDropdown = !showDropdown" 
              class="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-all focus:outline-none">
        <div class="hidden md:flex flex-col text-right">
          <p class="text-xs font-black text-on-surface uppercase">{{ user?.name || 'Admin' }}</p>
          <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{{ user?.role || 'Super Admin' }}</p>
        </div>
        <div class="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center font-black text-primary text-xs md:text-sm shadow-sm overflow-hidden">
          <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" />
          <span v-else>{{ user?.name?.substring(0, 2).toUpperCase() || 'AD' }}</span>
        </div>
      </button>

      <!-- Dropdown Menu -->
      <div v-if="showDropdown" 
           class="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2">
        <div class="px-4 py-3 border-b border-outline-variant/5 mb-1 md:hidden">
          <p class="text-xs font-black text-on-surface uppercase">{{ user?.name || 'Admin' }}</p>
          <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{{ user?.role || 'Super Admin' }}</p>
        </div>
        <button @click="handleLogout" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-error hover:bg-error/5 transition-all">
          <span class="material-symbols-outlined text-lg">logout</span>
          Keluar Aplikasi
        </button>
      </div>

      <!-- Backdrop for closing dropdown -->
      <div v-if="showDropdown" @click="showDropdown = false" class="fixed inset-0 z-[-1]"></div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  title: String,
  subtitle: String
})

defineEmits(['toggle-sidebar'])

const router = useRouter()
const user = ref(null)
const showDropdown = ref(false)

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) user.value = JSON.parse(savedUser)
})
</script>
