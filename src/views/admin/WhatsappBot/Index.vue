<template>
  <DashboardLayout title="WhatsApp Bot">
    <div class="space-y-4 md:space-y-6 max-w-7xl mx-auto pb-10 overflow-x-hidden">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div class="space-y-1">
          <h2 class="text-2xl md:text-2xl font-black tracking-tight text-primary font-headline uppercase">Chatbot AI</h2>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium">Kelola chatbot WhatsApp Spec Camp dengan AI.</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">chat</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Total Bot</p>
              <p class="text-xl font-black text-on-surface">{{ bots.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-secondary">active</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Bot Aktif</p>
              <p class="text-xl font-black text-on-surface">{{ activeBots }}</p>
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
              <span class="material-symbols-outlined text-primary">api</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Status API</p>
              <p class="text-xl font-black text-on-surface">{{ apiStatus }}</p>
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
      <template v-if="activeTab === 'settings'">
        <div v-if="bots.length === 0" class="bg-surface-container-low rounded-2xl p-8 text-center">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">chat_bubble</span>
          <p class="text-on-surface-variant font-medium">Belum ada bot yang dikonfigurasi</p>
          <p class="text-xs text-on-surface-variant/50 mt-1">Tambah bot untuk mulai menggunakan chatbot AI</p>
        </div>

        <div v-for="bot in bots" :key="bot.id" class="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                     :class="bot.isActive ? 'bg-primary/10' : 'bg-surface-container'">
                  <span class="material-symbols-outlined text-xl" :class="bot.isActive ? 'text-primary' : 'text-on-surface-variant'">
                    {{ bot.isActive ? 'chat' : 'chat_bubble_off' }}
                  </span>
                </div>
                <div>
                  <h3 class="font-black text-on-surface">{{ bot.name }}</h3>
                  <p class="text-xs text-on-surface-variant font-medium">{{ bot.phoneNumber }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                          :class="bot.isActive ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'">
                      {{ bot.isActive ? 'Aktif' : 'Nonaktif' }}
                    </span>
                    <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                      {{ bot.aiModel }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="openBotModal(bot)"
                        class="px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container-high transition-all flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button @click="toggleBotStatus(bot)"
                        class="px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1"
                        :class="bot.isActive ? 'bg-error/10 text-error hover:bg-error/20' : 'bg-primary/10 text-primary hover:bg-primary/20'">
                  <span class="material-symbols-outlined text-sm">{{ bot.isActive ? 'stop' : 'play_arrow' }}</span>
                  {{ bot.isActive ? 'Matikan' : 'Aktifkan' }}
                </button>
              </div>
            </div>

            <!-- Setting Sections -->
            <div class="space-y-4">
              <!-- QR Configuration -->
              <div class="p-4 bg-surface rounded-xl border border-outline-variant/5">
                <h4 class="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Konfigurasi QR</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-on-surface-variant font-medium">Token Device:</span>
                    <p class="font-mono text-on-surface text-xs mt-1">{{ bot.deviceToken }}</p>
                  </div>
                  <div>
                    <span class="text-on-surface-variant font-medium">Status:</span>
                    <p class="text-on-surface mt-1">{{ bot.isActive ? 'Terhubung' : 'Belum terhubung' }}</p>
                  </div>
                </div>
                <p class="text-xs text-on-surface-variant/50 mt-3">Scan QR code di WhatsApp untuk menghubungkan device ini.</p>
              </div>

              <!-- AI Model -->
              <div class="p-4 bg-surface rounded-xl border border-outline-variant/5">
                <h4 class="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Model AI</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="text-on-surface-variant font-medium">Model:</span>
                    <p class="text-on-surface mt-1">{{ bot.aiModel }}</p>
                  </div>
                  <div>
                    <span class="text-on-surface-variant font-medium">Max Tokens:</span>
                    <p class="text-on-surface mt-1">{{ bot.maxTokens }}</p>
                  </div>
                  <div>
                    <span class="text-on-surface-variant font-medium">Temperature:</span>
                    <p class="text-on-surface mt-1">{{ bot.temperature }}</p>
                  </div>
                </div>
              </div>

              <!-- AI Instructions -->
              <div v-if="bot.aiInstructions" class="p-4 bg-surface rounded-xl border border-outline-variant/5">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-xs font-black uppercase tracking-widest text-on-surface-variant">Instruksi AI</h4>
                  <button @click="copyInstructions(bot.aiInstructions)"
                          class="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">copy</span>
                    Salin
                  </button>
                </div>
                <pre class="text-xs text-on-surface-variant/70 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">{{ bot.aiInstructions }}</pre>
              </div>

              <!-- Welcome Message -->
              <div v-if="bot.welcomeMessage" class="p-4 bg-surface rounded-xl border border-outline-variant/5">
                <h4 class="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Pesan Sapaan</h4>
                <p class="text-sm text-on-surface">{{ bot.welcomeMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Bot Button -->
        <div class="mt-4">
          <button @click="openBotModal()"
                  class="w-full bg-primary text-on-primary px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
            <span class="material-symbols-outlined">add</span>
            Tambah Bot Baru
          </button>
        </div>
      </template>

      <!-- History Tab -->
      <template v-if="activeTab === 'history'">
        <div class="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div class="p-4 md:p-6 border-b border-outline-variant/10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 class="font-black text-on-surface">Riwayat Percakapan</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-1">Daftar pesan yang dikirim dan diterima oleh bot.</p>
              </div>
              <div class="flex items-center gap-2">
                <select v-model="historyBotFilter"
                        class="px-4 py-2 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-xs focus:outline-none focus:border-primary transition-colors">
                  <option value="">Semua Bot</option>
                  <option v-for="bot in bots" :key="bot.id" :value="bot.deviceToken">{{ bot.name }}</option>
                </select>
                <button @click="fetchHistory"
                        class="px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container-high transition-all flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">refresh</span>
                  Refresh
                </button>
              </div>
            </div>
          </div>
          <div class="p-4 md:p-6">
            <div v-if="historyLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div v-else-if="chatHistory.length === 0" class="text-center py-12">
              <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">chat</span>
              <p class="text-on-surface-variant font-medium">Belum ada riwayat chat</p>
              <p class="text-xs text-on-surface-variant/50 mt-1">Kirim pesan ke bot untuk melihat riwayat di sini</p>
            </div>

            <div v-else class="space-y-3 max-h-[600px] overflow-y-auto">
              <div v-for="(msg, idx) in filteredHistory" :key="idx"
                   class="flex gap-3 p-3 rounded-xl"
                   :class="msg.role === 'user' ? 'bg-primary/5 border border-primary/10' : 'bg-surface-container border border-outline-variant/5'">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                     :class="msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'">
                  <span class="material-symbols-outlined text-sm">{{ msg.role === 'user' ? 'person' : 'smart_toy' }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-black uppercase tracking-widest"
                          :class="msg.role === 'user' ? 'text-primary' : 'text-secondary'">
                      {{ msg.role === 'user' ? 'Pengguna' : 'Bot' }}
                    </span>
                    <span class="text-[10px] text-on-surface-variant/50">{{ formatDate(msg.timestamp) }}</span>
                  </div>
                  <p class="text-sm text-on-surface font-medium whitespace-pre-wrap">{{ msg.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Bot Config Modal -->
    <Teleport to="body">
      <div v-if="showBotModal" class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
           @click.self="showBotModal = false">
        <div class="bg-surface-container-low rounded-2xl border border-outline-variant/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="p-6 border-b border-outline-variant/10">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-black text-on-surface">{{ editingBot ? 'Edit Bot' : 'Tambah Bot' }}</h3>
              <button @click="showBotModal = false" class="text-on-surface-variant hover:text-error transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nama Bot</label>
              <input v-model="botForm.name" type="text" placeholder="Contoh: Admin Spec Camp"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nomor WhatsApp</label>
              <input v-model="botForm.phoneNumber" type="text" placeholder="62812xxxx"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Token Device</label>
              <input v-model="botForm.deviceToken" type="text" placeholder="device_admin_spec"
                     class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Model AI</label>
              <select v-model="botForm.aiModel"
                      class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors">
                <option value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B</option>
                <option value="google/gemma-2-2b-it">Gemma 2B</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Instruksi AI (Markdown)</label>
              <textarea v-model="botForm.aiInstructions" rows="6"
                        placeholder="Tulis instruksi AI dalam format Markdown...&#10;&#10;Contoh:&#10;# Spec Camp AI Assistant&#10;&#10;Anda adalah asisten chatbot untuk Spec Camp.&#10;Jawab pertanyaan tentang paket, harga, dan booking."
                        class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors font-mono" />
            </div>
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Pesan Sapaan</label>
              <textarea v-model="botForm.welcomeMessage" rows="3"
                        placeholder="Halo! 👋 Selamat datang..."
                        class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Max Tokens</label>
                <input v-model.number="botForm.maxTokens" type="number" min="100" max="2000"
                       class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Temperature</label>
                <input v-model.number="botForm.temperature" type="number" min="0" max="1" step="0.1"
                       class="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/10 text-on-surface font-medium text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/10 flex justify-end gap-2">
            <button @click="showBotModal = false"
                    class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-all">
              Batal
            </button>
            <button @click="saveBot"
                    class="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10">
              {{ editingBot ? 'Simpan' : 'Tambah Bot' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/admin/DashboardLayout.vue'

const bots = ref([])
const loading = ref(true)
const activeTab = ref('settings')
const showBotModal = ref(false)
const editingBot = ref(null)
const historyBotFilter = ref('')
const historyLoading = ref(false)
const chatHistory = ref([])

const botForm = ref({
  name: '',
  phoneNumber: '',
  deviceToken: '',
  aiModel: 'mistralai/Mistral-7B-Instruct-v0.2',
  aiInstructions: '',
  welcomeMessage: 'Halo! 👋 Selamat datang di Spec Camp. Ada yang bisa kami bantu?',
  maxTokens: 500,
  temperature: 0.7
})

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.speccamp.site/api'
const API_SECRET_KEY = 'a3acdd0514fdd0956349281b552bb7de84a2929fd5d20afd5b6554dc3f50da07'

const activeBots = computed(() => bots.value.filter(b => b.isActive).length)
const currentModel = computed(() => {
  const active = bots.value.find(b => b.isActive)
  return active ? active.aiModel.split('/').pop() : '-'
})
const apiStatus = computed(() => {
  return bots.value.length > 0 ? 'Terhubung' : 'Tidak Aktif'
})

const filteredHistory = computed(() => {
  if (!historyBotFilter.value) return chatHistory.value
  return chatHistory.value.filter(msg => msg.deviceToken === historyBotFilter.value)
})

const fetchBots = async () => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots`, {
      headers: { 'x-api-key': API_SECRET_KEY }
    })
    const data = await response.json()
    if (data.success) {
      bots.value = data.data
    }
  } catch (error) {
    console.error('Failed to fetch bots:', error)
  } finally {
    loading.value = false
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
      chatHistory.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch history:', error)
  } finally {
    historyLoading.value = false
  }
}

const openBotModal = (bot = null) => {
  editingBot.value = bot
  if (bot) {
    botForm.value = {
      name: bot.name,
      phoneNumber: bot.phoneNumber,
      deviceToken: bot.deviceToken,
      aiModel: bot.aiModel,
      aiInstructions: bot.aiInstructions || '',
      welcomeMessage: bot.welcomeMessage || '',
      maxTokens: bot.maxTokens || 500,
      temperature: bot.temperature || 0.7
    }
  } else {
    botForm.value = {
      name: '',
      phoneNumber: '',
      deviceToken: '',
      aiModel: 'mistralai/Mistral-7B-Instruct-v0.2',
      aiInstructions: '',
      welcomeMessage: 'Halo! 👋 Selamat datang di Spec Camp. Ada yang bisa kami bantu?',
      maxTokens: 500,
      temperature: 0.7
    }
  }
  showBotModal.value = true
}

const saveBot = async () => {
  try {
    const url = editingBot.value
      ? `${API_BASE}/whatsapp/bots/${editingBot.value.deviceToken}`
      : `${API_BASE}/whatsapp/bots`

    const method = editingBot.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify(botForm.value)
    })

    const data = await response.json()
    if (data.success) {
      showBotModal.value = false
      await fetchBots()
    }
  } catch (error) {
    console.error('Failed to save bot:', error)
  }
}

const toggleBotStatus = async (bot) => {
  try {
    const response = await fetch(`${API_BASE}/whatsapp/bots/${bot.deviceToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify({ isActive: !bot.isActive })
    })

    const data = await response.json()
    if (data.success) {
      await fetchBots()
    }
  } catch (error) {
    console.error('Failed to toggle bot:', error)
  }
}

const copyInstructions = (text) => {
  navigator.clipboard.writeText(text)
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
  fetchBots()
})
</script>