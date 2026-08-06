<template>
  <div class="space-y-4">
    <!-- Connect WhatsApp Modal -->
    <Teleport to="body">
      <div v-if="showConnectModal" class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
           @click.self="showConnectModal = false">
        <div class="bg-surface-container-low rounded-2xl border border-outline-variant/10 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="p-6 border-b border-outline-variant/10">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-black text-on-surface">Hubungkan WhatsApp</h3>
              <button @click="showConnectModal = false" class="text-on-surface-variant hover:text-error transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
      <div class="p-6 space-y-4">
             <div v-if="qrCodeUrl" class="flex flex-col items-center gap-4">
               <p class="text-sm text-on-surface-variant font-medium">Scan QR code di WhatsApp untuk menghubungkan device.</p>
               <img :src="qrCodeUrl" alt="QR Code" class="w-48 h-48 border border-outline-variant/10 rounded-xl" />
               <p class="text-xs text-on-surface-variant/50">Device: device_admin_spec</p>
               <div v-if="pollingStatus" class="flex items-center gap-2 text-xs text-on-surface-variant">
                 <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                 {{ pollingStatus }}
               </div>
             </div>
             <div v-else class="flex flex-col items-center gap-4">
               <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p class="text-sm text-on-surface-variant font-medium">Memuat QR code...</p>
             </div>
             <div class="flex gap-2 pt-2">
               <button @click="closeModal"
                       class="flex-1 px-4 py-3 bg-surface-container text-on-surface-variant font-semibold text-sm rounded-xl hover:bg-surface-container-high transition-all">
                 Tutup
               </button>
               <button @click="refreshQR"
                       class="flex-1 px-4 py-3 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all">
                 Refresh QR
               </button>
             </div>
           </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification -->
    <Teleport to="body">
      <div v-if="toast.show" class="fixed top-4 right-4 z-[200] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all"
           :class="toast.type === 'success' ? 'bg-primary text-on-primary' : 'bg-error text-on-error'">
        <span class="material-symbols-outlined text-sm">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        <span class="text-sm font-bold">{{ toast.message }}</span>
      </div>
    </Teleport>

    <!-- Settings Form -->
    <div class="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
      <div class="p-4 md:p-6 border-b border-outline-variant/10">
        <h3 class="font-black text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">settings</span>
          Pengaturan Bot
        </h3>
      </div>
      <div class="p-4 md:p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nama Bot</label>
              <input v-model="name" type="text"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nomor WhatsApp</label>
              <input v-model="phoneNumber" type="text"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Model AI</label>
              <select v-model="aiModel"
                      class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors">
                <option value="Qwen/Qwen2.5-7B-Instruct">Qwen 2.5 7B Instruct</option>
                <option value="google/gemma-2-2b-it">Gemma 2B</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Status</label>
              <select v-model="isActive"
                      class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors">
                <option :value="true">Aktif</option>
                <option :value="false">Nonaktif</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Pesan Sapaan</label>
            <textarea v-model="welcomeMessage" rows="3"
                      class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors"></textarea>
          </div>
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Instruksi AI (Markdown)</label>
            <textarea v-model="aiInstructions" rows="12"
                      class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors font-mono"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Max Tokens</label>
              <input v-model.number="maxTokens" type="number" min="100" max="2000"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Temperature</label>
              <input v-model.number="temperature" type="number" min="0" max="1" step="0.1"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="$emit('save')"
                  :disabled="saving"
                  class="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2">
            <span v-if="saving" class="material-symbols-outlined text-sm animate-spin">autorenew</span>
            <span v-else class="material-symbols-outlined text-sm">save</span>
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  bot: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'update:bot'])

const showConnectModal = ref(false)
const qrCodeUrl = ref('')
const toast = ref({ show: false, type: 'success', message: '' })
const pollingStatus = ref('')
const pollingInterval = ref(null)

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.speccamp.site/api'
const API_SECRET_KEY = 'a3acdd0514fdd0956349281b552bb7de84a2929fd5d20afd5b6554dc3f50da07'

const createField = (field) => computed({
  get: () => props.bot[field],
  set: (value) => emit('update:bot', { ...props.bot, [field]: value })
})

const name = createField('name')
const phoneNumber = createField('phoneNumber')
const aiModel = createField('aiModel')
const isActive = createField('isActive')
const welcomeMessage = createField('welcomeMessage')
const aiInstructions = createField('aiInstructions')
const maxTokens = createField('maxTokens')
const temperature = createField('temperature')

const startPolling = () => {
  if (pollingInterval.value) clearInterval(pollingInterval.value)
  pollingStatus.value = 'Memeriksa status koneksi...'
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/bots/device_admin_spec/status`, {
        headers: { 'x-api-key': API_SECRET_KEY }
      })
      const data = await response.json()
      if (data.success && data.data?.isActive) {
        if (pollingInterval.value) clearInterval(pollingInterval.value)
        pollingInterval.value = null
        pollingStatus.value = ''
        showConnectModal.value = false
        emit('update:bot', { ...props.bot, isActive: true })
        showToast('success', 'WhatsApp berhasil terhubung!')
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, 3000)
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  pollingStatus.value = ''
}

const connectWhatsApp = async () => {
  showConnectModal.value = true
  qrCodeUrl.value = ''
  startPolling()
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/device_admin_spec/qr`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success && data.data && data.data.qrCode) {
      qrCodeUrl.value = await QRCode.toDataURL(data.data.qrCode)
    }
  } catch (error) {
    console.error('Failed to fetch QR code:', error)
  }
}

const refreshQR = async () => {
  qrCodeUrl.value = ''
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/device_admin_spec/qr`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success && data.data && data.data.qrCode) {
      qrCodeUrl.value = await QRCode.toDataURL(data.data.qrCode)
    }
  } catch (error) {
    console.error('Failed to refresh QR code:', error)
  }
}

const closeModal = () => {
  stopPolling()
  showConnectModal.value = false
}

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

defineExpose({
  connectWhatsApp
})
</script>
