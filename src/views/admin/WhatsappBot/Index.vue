<template>
  <DashboardLayout title="WhatsApp Bot">
    <div class="space-y-4 md:space-y-6 max-w-7xl mx-auto pb-10 overflow-x-hidden">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div class="space-y-1">
          <h2 class="text-2xl md:text-2xl font-black tracking-tight text-primary font-headline uppercase">Chatbot AI</h2>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium">Kelola chatbot WhatsApp Spec Camp dengan AI.</p>
        </div>
        <button @click="connectWhatsApp"
                class="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined text-sm">link</span>
          Hubungkan WhatsApp
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
              <span class="material-symbols-outlined text-primary">{{ bot.isActive ? 'circle' : 'circle_outlined' }}</span>
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
        <button @click="activeTab = 'settings'"
                class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                :class="activeTab === 'settings' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container'">
          <span class="material-symbols-outlined text-sm align-middle mr-1">settings</span>
          Setting
        </button>
        <button @click="activeTab = 'history'"
                class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                :class="activeTab === 'history' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container'">
          <span class="material-symbols-outlined text-sm align-middle mr-1">history</span>
          Riwayat Chat
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Settings Tab -->
      <template v-if="activeTab === 'settings' && !loading">
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
                </div>
                <div v-else class="flex flex-col items-center gap-4">
                  <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p class="text-sm text-on-surface-variant font-medium">Memuat QR code...</p>
                </div>
                <div class="flex gap-2 pt-2">
                  <button @click="showConnectModal = false"
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
                <input v-model="bot.name" type="text"
                       class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nomor WhatsApp</label>
                <input v-model="bot.phoneNumber" type="text"
                       class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Model AI</label>
                <select v-model="bot.aiModel"
                        class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors">
                  <option value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B</option>
                  <option value="google/gemma-2-2b-it">Gemma 2B</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Status</label>
                <select v-model="bot.isActive"
                        class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors">
                  <option :value="true">Aktif</option>
                  <option :value="false">Nonaktif</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Pesan Sapaan</label>
              <textarea v-model="bot.welcomeMessage" rows="3"
                        class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors"></textarea>
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Instruksi AI (Markdown)</label>
              <textarea v-model="bot.aiInstructions" rows="12"
                        class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors font-mono"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Max Tokens</label>
                <input v-model.number="bot.maxTokens" type="number" min="100" max="2000"
                       class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Temperature</label>
                <input v-model.number="bot.temperature" type="number" min="0" max="1" step="0.1"
                       class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button @click="saveBot"
                      :disabled="saving"
                      class="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2">
                <span v-if="saving" class="material-symbols-outlined text-sm animate-spin">autorenew</span>
                <span v-else class="material-symbols-outlined text-sm">save</span>
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- History Tab with WhatsApp-like Chat -->
      <template v-if="activeTab === 'history' && !loading">
        <div class="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden" style="min-height: 500px;">
          <div class="flex" style="height: 500px;">
            <!-- Contact List -->
            <div class="w-72 border-r border-outline-variant/10 flex flex-col bg-surface">
              <div class="p-3 border-b border-outline-variant/10">
                <input v-model="contactSearch" type="text" placeholder="Cari nomor..."
                       class="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface font-medium text-xs focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div class="flex-1 overflow-y-auto">
                <div v-if="contacts.length === 0" class="p-4 text-center">
                  <p class="text-xs text-on-surface-variant">Belum ada kontak</p>
                </div>
                <div v-for="contact in filteredContacts" :key="contact.phone"
                     @click="selectContact(contact)"
                     class="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface-container-high transition-colors border-b border-outline-variant/5"
                     :class="selectedContact?.phone === contact.phone ? 'bg-surface-container-high' : ''">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-on-surface truncate">{{ contact.phone }}</p>
                    <p class="text-[10px] text-on-surface-variant truncate">{{ contact.lastMessage || 'Belum ada pesan' }}</p>
                  </div>
                  <span class="text-[10px] text-on-surface-variant/50 flex-shrink-0">{{ formatTime(contact.lastTimestamp) }}</span>
                </div>
              </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col">
              <div v-if="!selectedContact" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-2">chat</span>
                  <p class="text-sm text-on-surface-variant font-medium">Pilih kontak untuk mulai chat</p>
                  <p class="text-xs text-on-surface-variant/50 mt-1">Pilih dari daftar atau ketik nomor baru</p>
                </div>
              </div>
              <template v-else>
                <!-- Chat Header -->
                <div class="p-3 border-b border-outline-variant/10 flex items-center gap-3 bg-surface">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-on-surface">{{ selectedContact.phone }}</p>
                    <p class="text-[10px] text-on-surface-variant">{{ selectedContact.isOnline ? 'Online' : 'Terakhir terlihat' }}</p>
                  </div>
                  <button @click="clearChat" class="text-on-surface-variant hover:text-error transition-colors">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>

                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="chatContainer">
                  <div v-for="(msg, idx) in selectedContact.messages" :key="idx"
                       class="flex gap-2"
                       :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                    <div class="max-w-[70%] rounded-2xl px-4 py-2"
                         :class="msg.role === 'user'
                           ? 'bg-primary text-on-primary rounded-br-md'
                           : 'bg-surface-container text-on-surface rounded-bl-md'">
                      <p class="text-sm font-medium whitespace-pre-wrap">{{ msg.content }}</p>
                      <p class="text-[10px] mt-1 opacity-50">{{ formatTime(msg.timestamp) }}</p>
                    </div>
                  </div>
                  <div v-if="chatLoading" class="flex gap-2 justify-start">
                    <div class="bg-surface-container rounded-2xl rounded-bl-md px-4 py-2">
                      <div class="flex gap-1">
                        <div class="w-2 h-2 bg-on-surface-variant/30 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                        <div class="w-2 h-2 bg-on-surface-variant/30 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                        <div class="w-2 h-2 bg-on-surface-variant/30 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Message Input -->
                <div class="p-3 border-t border-outline-variant/10 bg-surface">
                  <div class="flex gap-2">
                    <input v-model="chatInput" type="text" placeholder="Ketik pesan..."
                           class="flex-1 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors"
                           @keyup.enter="sendChatMessage" />
                    <button @click="sendChatMessage"
                            :disabled="chatLoading || !chatInput.trim()"
                            class="px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'

const bot = ref({
  id: null,
  deviceToken: 'device_admin_spec',
  name: '',
  phoneNumber: '',
  aiModel: 'mistralai/Mistral-7B-Instruct-v0.2',
  aiInstructions: '',
  isActive: false,
  welcomeMessage: '',
  maxTokens: 500,
  temperature: 0.7
})

const loading = ref(true)
const saving = ref(false)
const activeTab = ref('settings')
const showConnectModal = ref(false)
const qrCodeUrl = ref('')
const chatInput = ref('')
const chatLoading = ref(false)
const chatContainer = ref(null)
const historyLoading = ref(false)
const contactSearch = ref('')
const selectedContact = ref(null)
const toast = ref({ show: false, type: 'success', message: '' })

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.speccamp.site/api'
const API_SECRET_KEY = 'a3acdd0514fdd0956349281b552bb7de84a2929fd5d20afd5b6554dc3f50da07'

const currentModel = computed(() => {
  return bot.value.aiModel ? bot.value.aiModel.split('/').pop() : '-'
})

const contacts = ref([])

const filteredContacts = computed(() => {
  if (!contactSearch.value) return contacts.value
  return contacts.value.filter(c => c.phone.includes(contactSearch.value))
})

const fetchBot = async (deviceToken) => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${deviceToken}`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success && data.data) {
      bot.value = data.data
    }
  } catch (error) {
    console.error('Failed to fetch bot:', error)
  } finally {
    loading.value = false
  }
}

const connectWhatsApp = async () => {
  showConnectModal.value = true
  qrCodeUrl.value = ''
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/device_admin_spec/qr`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success && data.data && data.data.qrCode) {
      qrCodeUrl.value = data.data.qrCode
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
      qrCodeUrl.value = data.data.qrCode
    }
  } catch (error) {
    console.error('Failed to refresh QR code:', error)
  }
}

const saveBot = async () => {
  saving.value = true
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${bot.value.deviceToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify(bot.value)
    })
    const data = await response.json()
    if (data.success) {
      bot.value = data.data
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

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const selectContact = (contact) => {
  selectedContact.value = contact
}

const clearChat = () => {
  if (selectedContact.value) {
    selectedContact.value.messages = []
  }
}

const sendChatMessage = async () => {
  if (!chatInput.value.trim() || chatLoading.value || !selectedContact.value) return
  const message = chatInput.value.trim()
  chatInput.value = ''
  selectedContact.value.messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() })
  chatLoading.value = true
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${bot.value.deviceToken}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify({ message, phone: selectedContact.value.phone })
    })
    const data = await response.json()
    if (data.success && data.data) {
      selectedContact.value.messages.push({ role: 'bot', content: data.data.response, timestamp: new Date().toISOString() })
    } else {
      selectedContact.value.messages.push({ role: 'bot', content: 'Maaf, terjadi kesalahan.', timestamp: new Date().toISOString() })
    }
  } catch (error) {
    selectedContact.value.messages.push({ role: 'bot', content: 'Gagal terhubung ke server.', timestamp: new Date().toISOString() })
  } finally {
    chatLoading.value = false
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
}

const fetchHistory = async () => {
  historyLoading.value = true
  try {
    const response = await fetch(`${API_BASE}/whatsapp/history`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success) {
      const history = data.data || []
      const contactMap = {}
      history.forEach(msg => {
        const phone = msg.phone || 'unknown'
        if (!contactMap[phone]) {
          contactMap[phone] = {
            phone,
            lastMessage: msg.content,
            lastTimestamp: msg.timestamp,
            isOnline: false,
            messages: []
          }
        }
        contactMap[phone].messages.push({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })
      })
      contacts.value = Object.values(contactMap).sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp))
    }
  } catch (error) {
    console.error('Failed to fetch history:', error)
  } finally {
    historyLoading.value = false
  }
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchBot('device_admin_spec')
  fetchHistory()
})
</script>