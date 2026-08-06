<template>
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
         <div v-if="!selectedContact" class="flex-1 flex flex-col items-center justify-center p-4">
           <div class="text-center mb-4">
             <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-2">chat</span>
             <p class="text-sm text-on-surface-variant font-medium">Pilih kontak untuk mulai chat</p>
             <p class="text-xs text-on-surface-variant/50 mt-1">Pilih dari daftar atau ketik nomor baru</p>
           </div>
           <div class="flex gap-2 w-full max-w-xs">
             <input v-model="newContactPhone" type="text" placeholder="Nomor telepon..."
                    class="flex-1 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors"
                    @keyup.enter="startNewChat" />
             <button @click="startNewChat"
                     :disabled="!newContactPhone.trim()"
                     class="px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1">
               <span class="material-symbols-outlined text-sm">add</span>
             </button>
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

const filteredContacts = computed(() => {
  if (!contactSearch.value) return contacts.value
  return contacts.value.filter(c => c.phone.includes(contactSearch.value))
})

const fetchHistory = async () => {
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
  }
}

const selectContact = (contact) => {
  selectedContact.value = contact
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

const clearChat = () => {
  if (selectedContact.value) {
    selectedContact.value.messages = []
  }
}

const sendChatMessage = async () => {
  if (!chatInput.value.trim() || chatLoading.value || !selectedContact.value) return
  const message = chatInput.value.trim()
  const phone = selectedContact.value.phone
  chatInput.value = ''
  selectedContact.value.messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() })
  chatLoading.value = true
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
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
    if (data.success) {
      selectedContact.value.messages.push({ role: 'bot', content: 'Pesan terkirim ✓', timestamp: new Date().toISOString() })
    } else {
      selectedContact.value.messages.push({ role: 'bot', content: 'Gagal mengirim pesan.', timestamp: new Date().toISOString() })
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
})
</script>
