<template>
  <div class="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden" style="min-height: 500px;">
    <div class="flex" style="height: 500px;">
      <!-- Contact List -->
      <div class="w-72 border-r border-outline-variant/10 flex flex-col bg-surface">
        <div class="p-3 border-b border-outline-variant/10 flex items-center gap-2">
          <input v-model="contactSearch" type="text" placeholder="Cari nomor..."
                 class="flex-1 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface font-medium text-xs focus:outline-none focus:border-primary transition-colors" />
          <button @click="showNewChatDialog = true"
                  class="px-3 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 flex-shrink-0">
            <span class="material-symbols-outlined text-sm">chat</span>
            <span class="hidden sm:inline">Baru</span>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="contacts.length === 0" class="p-4 text-center">
            <p class="text-xs text-on-surface-variant">Belum ada kontak</p>
          </div>
          <div v-for="contact in filteredContacts" :key="contact.phone"
               @click="selectContact(contact)"
               class="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface-container-high transition-colors border-b border-outline-variant/5"
               :class="selectedContact?.phone === contact.phone ? 'bg-surface-container-high' : ''">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <p class="text-sm font-bold text-on-surface truncate">{{ contact.phone }}</p>
                <span v-if="isPhonePaused(contact.phone)" class="material-symbols-outlined text-secondary text-xs" title="Auto-reply dijeda">pause_circle</span>
              </div>
              <p class="text-[10px] text-on-surface-variant truncate">{{ contact.lastMessage || 'Belum ada pesan' }}</p>
            </div>
            <span class="text-[10px] text-on-surface-variant/50 flex-shrink-0">{{ formatTime(contact.lastTimestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <div v-if="!selectedContact" class="flex-1 flex flex-col items-center justify-center p-4">
          <div class="text-center">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-2">chat</span>
            <p class="text-sm text-on-surface-variant font-medium">Pilih kontak untuk mulai chat</p>
            <p class="text-xs text-on-surface-variant/50 mt-1">Pilih dari daftar atau klik tombol Baru</p>
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
            <button @click="togglePause(selectedContact.phone)"
                    :class="isPhonePaused(selectedContact.phone)
                      ? 'text-secondary hover:bg-secondary/10'
                      : 'text-on-surface-variant hover:bg-surface-container-high'"
                    class="p-2 rounded-lg transition-colors"
                    :title="isPhonePaused(selectedContact.phone) ? 'Aktifkan kembali auto-reply' : 'Jeda auto-reply'">
              <span class="material-symbols-outlined text-sm">{{ isPhonePaused(selectedContact.phone) ? 'play_circle' : 'pause_circle' }}</span>
            </button>
            <button @click="clearChat" class="text-on-surface-variant hover:text-error transition-colors">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="chatContainer">
            <div v-for="(msg, idx) in selectedContact.messages" :key="idx"
                 class="flex gap-2"
                 :class="msg.role === 'outgoing' ? 'justify-end' : 'justify-start'">
              <div class="max-w-[70%] rounded-2xl px-4 py-2"
                   :class="msg.role === 'outgoing'
                     ? 'bg-primary text-on-primary rounded-br-md'
                     : 'bg-surface-container text-on-surface rounded-bl-md'">
<p class="text-sm font-medium whitespace-pre-wrap">{{ msg.content }}</p>
                 <p class="text-[10px] mt-1 opacity-50 flex items-center gap-1">
                   <span>{{ formatTime(msg.timestamp) }}</span>
                    <span v-if="msg.role === 'outgoing'" class="material-symbols-outlined text-xs">done</span>
                 </p>
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

    <!-- New Chat Dialog -->
    <Teleport to="body">
      <div v-if="showNewChatDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" @click.self="showNewChatDialog = false">
        <div class="bg-surface-container rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-outline-variant/10">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary">chat</span>
            <h3 class="text-sm font-bold text-on-surface">Mulai Chat Baru</h3>
          </div>
          <p class="text-xs text-on-surface-variant mb-4">Masukkan nomor telepon untuk memulai chat baru</p>
          <input v-model="newContactPhone" type="text" placeholder="Nomor telepon..."
                 class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors mb-4"
                 @keyup.enter="confirmNewChat" />
          <div class="flex gap-2 justify-end">
            <button @click="showNewChatDialog = false"
                    class="px-4 py-2 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Batal
            </button>
            <button @click="confirmNewChat"
                    :disabled="!newContactPhone.trim()"
                    class="px-4 py-2 rounded-xl font-semibold text-sm bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50">
              Mulai Chat
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.speccamp.site/api'
const API_SECRET_KEY = 'a3acdd0514fdd0956349281b552bb7de84a2929fd5d20afd5b6554dc3f50da07'

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

const contacts = ref([])
const selectedContact = ref(null)
const chatInput = ref('')
const chatLoading = ref(false)
const chatContainer = ref(null)
const contactSearch = ref('')
const newContactPhone = ref('')
const showNewChatDialog = ref(false)
const pausedPhones = ref([])

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

const filteredContacts = computed(() => {
  if (!contactSearch.value) return contacts.value
  return contacts.value.filter(c => c.phone.includes(contactSearch.value))
})

const fetchPausedPhones = async () => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${props.bot.deviceToken}/paused-phones`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success) {
      pausedPhones.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch paused phones:', error)
  }
}

const isPhonePaused = (phone) => {
  const clean = phone.replace(/[^0-9]/g, '')
  return pausedPhones.value.some(p => p.replace(/[^0-9]/g, '') === clean)
}

const togglePause = async (phone) => {
  const clean = phone.replace(/[^0-9]/g, '')
  const paused = isPhonePaused(phone)
  try {
    if (paused) {
      const response = await fetch(`${API_BASE}/whatsapp/bots/${props.bot.deviceToken}/paused-phones/${clean}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_SECRET_KEY }
      })
      const data = await response.json()
      if (data.success) {
        pausedPhones.value = data.data || []
        showToast('success', `Auto-reply diaktifkan untuk ${phone}`)
      }
    } else {
      const response = await fetch(`${API_BASE}/whatsapp/bots/${props.bot.deviceToken}/paused-phones`, {
        method: 'POST',
        headers: {
          'x-api-key': API_SECRET_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: clean })
      })
      const data = await response.json()
      if (data.success) {
        pausedPhones.value = data.data || []
        showToast('success', `Auto-reply dijeda untuk ${phone}`)
      }
    }
  } catch (error) {
    console.error('Toggle pause error:', error)
    showToast('error', 'Gagal mengubah status pause')
  }
}

const fetchHistory = async () => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/history?deviceToken=${props.bot?.deviceToken || ''}&limit=1000`, {
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
            lastMessage: msg.message || msg.response || '',
            lastTimestamp: msg.createdAt,
            isOnline: false,
            messages: []
          }
        }
        if (msg.message) {
          contactMap[phone].messages.push({
            role: 'incoming',
            content: msg.message,
            timestamp: msg.createdAt
          })
        }
        if (msg.response) {
          contactMap[phone].messages.push({
            role: 'outgoing',
            content: msg.response,
            timestamp: msg.createdAt
          })
        }
      })
      contacts.value = Object.values(contactMap)
        .map(contact => ({
          ...contact,
          messages: contact.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        }))
        .sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp))
    }
  } catch (error) {
    console.error('Failed to fetch history:', error)
  }
}

const selectContact = async (contact) => {
  selectedContact.value = contact
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const startNewChat = () => {
  const phone = newContactPhone.value.trim()
  if (!phone) return
  const existing = contacts.value.find(c => c.phone === phone)
  if (existing) {
    selectedContact.value = existing
  } else {
    const newContact = {
      phone,
      lastMessage: '',
      lastTimestamp: new Date().toISOString(),
      isOnline: false,
      messages: []
    }
    contacts.value.unshift(newContact)
    selectedContact.value = newContact
  }
  newContactPhone.value = ''
}

const confirmNewChat = async () => {
  const phone = newContactPhone.value.trim()
  if (!phone) return
  showNewChatDialog.value = false
  const existing = contacts.value.find(c => c.phone === phone)
  if (existing) {
    selectedContact.value = existing
  } else {
    const newContact = {
      phone,
      lastMessage: '',
      lastTimestamp: new Date().toISOString(),
      isOnline: false,
      messages: []
    }
    contacts.value.unshift(newContact)
    selectedContact.value = newContact
  }
  newContactPhone.value = ''
  await nextTick()
  scrollToBottom()
}

const clearChat = async () => {
  if (!selectedContact.value) return
  const phone = selectedContact.value.phone
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${props.bot.deviceToken}/history/${phone}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success) {
      selectedContact.value.messages = []
      contacts.value = contacts.value.filter(c => c.phone !== phone)
      selectedContact.value = null
      showToast('success', 'Riwayat chat berhasil dihapus')
    } else {
      showToast('error', 'Gagal menghapus riwayat chat')
    }
  } catch (error) {
    console.error('Delete history error:', error)
    showToast('error', 'Gagal menghapus riwayat chat')
  }
}

const normalizeWhatsAppNumber = (phone) => {
  let num = phone.replace(/\D/g, '')
  if (num.startsWith('0')) {
    num = '62' + num.slice(1)
  } else if (num.startsWith('62')) {
    num = num
  } else if (num.startsWith('8') && num.length <= 12) {
    num = '62' + num
  }
  return num
}

const sendChatMessage = async () => {
  if (!chatInput.value.trim() || chatLoading.value || !selectedContact.value) return
  const message = chatInput.value.trim()
  const phone = normalizeWhatsAppNumber(selectedContact.value.phone)
  chatInput.value = ''
  selectedContact.value.messages.push({ role: 'outgoing', content: message, timestamp: new Date().toISOString() })
  chatLoading.value = true
  await nextTick()
  scrollToBottom()
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${props.bot.deviceToken}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify({ number: phone, message })
    })
    const data = await response.json()
    if (!data.success) {
      selectedContact.value.messages.pop()
      showToast('error', data.message || 'Gagal mengirim pesan')
    } else {
      showToast('success', 'Pesan terkirim')
    }
  } catch (error) {
    selectedContact.value.messages.pop()
    showToast('error', 'Gagal terhubung ke server')
  } finally {
    chatLoading.value = false
    await nextTick()
    scrollToBottom()
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
  fetchHistory()
  fetchPausedPhones()
})
</script>
