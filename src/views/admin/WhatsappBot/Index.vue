<template>
  <DashboardLayout title="WhatsApp Bot">
    <div class="space-y-4 md:space-y-6 max-w-7xl mx-auto pb-10 overflow-x-hidden">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div class="space-y-1">
          <h2 class="text-2xl md:text-2xl font-black tracking-tight text-primary font-headline uppercase">Chatbot AI</h2>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium">Kelola chatbot WhatsApp Spec Camp dengan AI.</p>
        </div>
        <button v-if="!bot.isActive" @click="handleConnectClick"
                class="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined text-sm">link</span>
          Hubungkan WhatsApp
        </button>
        <button v-else @click="logoutWhatsApp"
                class="px-4 py-2 bg-error text-on-error rounded-xl font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-error/10">
          <span class="material-symbols-outlined text-sm">logout</span>
          Putuskan Koneksi
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-secondary">phone</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Nomor WhatsApp</p>
              <p class="text-xl font-black text-on-surface">{{ bot.phoneNumber || '-' }}</p>
            </div>
          </div>
        </div>
        <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-tertiary">model_training</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Model AI</p>
              <p class="text-xl font-black text-on-surface">{{ currentModel }}</p>
            </div>
          </div>
        </div>
        <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined" :class="bot.isActive ? 'text-primary' : 'text-on-surface-variant'">{{ bot.isActive ? 'circle' : 'circle' }}</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Status</p>
              <p class="text-xl font-black text-on-surface">{{ bot.isActive ? 'Aktif' : 'Nonaktif' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-surface-container-low rounded-xl p-1 w-fit">
        <router-link to="/admin/whatsapp-bot/settings"
                     class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                     :class="$route.path === '/admin/whatsapp-bot/settings' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container'">
          <span class="material-symbols-outlined text-sm align-middle mr-1">settings</span>
          Setting
        </router-link>
        <router-link to="/admin/whatsapp-bot/history"
                     class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                     :class="$route.path === '/admin/whatsapp-bot/history' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container'">
          <span class="material-symbols-outlined text-sm align-middle mr-1">history</span>
          Riwayat Chat
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Tab Content -->
      <router-view v-slot="{ Component }">
        <component :is="Component" :bot="bot" :saving="saving" ref="tabRef" @save="saveBot" @update:bot="bot = $event" />
      </router-view>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'

const route = useRoute()
const router = useRouter()

const bot = ref({
  id: null,
  deviceToken: 'device_admin_spec',
  name: '',
  phoneNumber: '',
  aiModel: 'Qwen/Qwen3-4B-Instruct-2507',
  aiInstructions: '',
  isActive: false,
  welcomeMessage: '',
  maxTokens: 500,
  temperature: 0.7
})

const loading = ref(true)
const saving = ref(false)
const tabRef = ref(null)

const currentModel = computed(() => {
  return bot.value.aiModel ? bot.value.aiModel.split('/').pop() : '-'
})

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.speccamp.site/api'
const API_SECRET_KEY = 'a3acdd0514fdd0956349281b552bb7de84a2929fd5d20afd5b6554dc3f50da07'

const fetchBot = async (deviceToken) => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${deviceToken}`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success && data.data) {
      data.data.isActive = Boolean(data.data.isActive);
      bot.value = data.data;
    }
  } catch (error) {
    console.error('Failed to fetch bot:', error)
  } finally {
    loading.value = false
  }
}

const logoutWhatsApp = async () => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/device_admin_spec/logout`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success) {
      bot.value.isActive = false
      showToast('success', 'Berhasil putus koneksi WhatsApp')
    } else {
      showToast('error', data.message || 'Gagal memutuskan koneksi')
    }
  } catch (error) {
    console.error('Failed to logout WhatsApp:', error)
    showToast('error', 'Gagal terhubung ke server')
  }
}

const showToast = (type, message) => {
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-[200] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all ${type === 'success' ? 'bg-primary text-on-primary' : 'bg-error text-on-error'}`
  toast.innerHTML = `
    <span class="material-symbols-outlined text-sm">${type === 'success' ? 'check_circle' : 'error'}</span>
    <span class="text-sm font-bold">${message}</span>
  `
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.remove()
  }, 3000)
}

const saveBot = async () => {
  saving.value = true
  try {
    const dataToSend = {
      ...bot.value,
      isActive: Boolean(bot.value.isActive)
    }
    const response = await fetch(`${API_BASE}/whatsapp/bots/${bot.value.deviceToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify(dataToSend)
    })
    const data = await response.json()
    if (data.success) {
      bot.value = data.data
      bot.value.isActive = Boolean(bot.value.isActive)
      showToast('success', 'Perubahan berhasil disimpan')
    } else {
      showToast('error', data.message || 'Gagal menyimpan perubahan')
    }
  } catch (error) {
    console.error('Failed to save bot:', error)
    showToast('error', 'Gagal terhubung ke server')
  } finally {
    saving.value = false
  }
}

const handleConnectClick = async () => {
  if (route.path !== '/admin/whatsapp-bot/settings') {
    await router.push('/admin/whatsapp-bot/settings')
  }
  await nextTick()
  await nextTick()
  tabRef.value?.connectWhatsApp?.()
}

onMounted(() => {
  fetchBot('device_admin_spec')
})
</script>
