<template>
  <DashboardLayout title="EXPEDITION" subtitle="PENGATURAN">
    <div class="space-y-6 max-w-4xl mx-auto pb-10">
      <div class="space-y-1">
        <h2 class="text-2xl font-black tracking-tight text-primary font-headline">Pengaturan</h2>
        <p class="text-on-surface-variant font-medium">Profil akun dan konfigurasi sistem.</p>
      </div>

      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
        <h3 class="text-base font-bold text-on-surface font-headline mb-6">Profil Saya</h3>
        
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex flex-col items-center gap-4">
            <div class="relative">
              <div class="w-28 h-28 rounded-2xl bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center overflow-hidden">
                <img v-if="previewAvatar || user?.avatar" :src="previewAvatar || user?.avatar" class="w-full h-full object-cover" />
                <span v-else class="text-4xl font-black text-primary">{{ user?.name?.substring(0, 2).toUpperCase() || 'AD' }}</span>
              </div>
              <button @click="triggerUpload" class="absolute -bottom-1 -right-1 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all text-sm">
                <span class="material-symbols-outlined text-lg">camera_alt</span>
              </button>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload">
            <p v-if="uploadingAvatar" class="text-xs text-primary font-medium">Mengupload...</p>
          </div>

          <div class="flex-1 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Nama Lengkap</label>
                <input v-model="form.name" type="text"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Email</label>
                <input :value="user?.email || ''" disabled
                       class="w-full bg-surface-container/50 px-4 py-2.5 rounded-xl border-none text-sm text-on-surface-variant cursor-not-allowed">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Nomor WhatsApp</label>
                <input v-model="form.phone" type="text"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Peran</label>
                <input :value="user?.role || '-'" disabled
                       class="w-full bg-surface-container/50 px-4 py-2.5 rounded-xl border-none text-sm text-on-surface-variant cursor-not-allowed">
              </div>
            </div>

            <div v-if="saveMessage" :class="saveSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-error-container text-on-error-container'" class="p-3 rounded-xl text-xs font-medium">{{ saveMessage }}</div>

            <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
              <button @click="resetForm" type="button" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">Reset</button>
              <button @click="saveProfile" :disabled="saving"
                      class="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
                {{ saving ? 'Menyimpan...' : 'Simpan Profil' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
        <h3 class="text-base font-bold text-on-surface font-headline mb-4">Konfigurasi Situs</h3>
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Nama Situs</label>
            <input type="text" value="Spec Camp Management" disabled class="w-full bg-surface-container/50 px-4 py-2.5 rounded-xl border-none text-sm text-on-surface-variant cursor-not-allowed">
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Email Dukungan</label>
            <input type="email" value="support@speccamp.site" disabled class="w-full bg-surface-container/50 px-4 py-2.5 rounded-xl border-none text-sm text-on-surface-variant cursor-not-allowed">
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'

const user = ref(null)
const saving = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)
const fileInput = ref(null)
const previewAvatar = ref('')
const uploadingAvatar = ref(false)

const form = reactive({
  name: '',
  phone: ''
})

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const triggerUpload = () => fileInput.value?.click()

const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(`${API}/upload/profile-avatar`, { method: 'POST', body: formData })
    const data = await res.json()
    if (data.success) {
      previewAvatar.value = data.url + '?_t=' + Date.now()
      await saveAvatarToProfile(data.url)
    }
  } catch {
    saveMessage.value = 'Gagal upload foto'
    saveSuccess.value = false
  } finally {
    uploadingAvatar.value = false
  }
}

const saveAvatarToProfile = async (url) => {
  try {
    const token = localStorage.getItem('token')
    await fetch(`${API}/users/${user.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ avatar: url })
    })
    if (user.value) user.value.avatar = url
    const stored = JSON.parse(localStorage.getItem('user') || '{}')
    stored.avatar = url
    localStorage.setItem('user', JSON.stringify(stored))
  } catch { console.error('save avatar failed') }
}

const saveProfile = async () => {
  saving.value = true
  saveMessage.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/users/${user.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: form.name, phone: form.phone })
    })
    const data = await res.json()
    if (data.success) {
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      stored.name = form.name
      localStorage.setItem('user', JSON.stringify(stored))
      saveMessage.value = 'Profil berhasil disimpan'
      saveSuccess.value = true
    } else {
      saveMessage.value = data.message || 'Gagal menyimpan'
      saveSuccess.value = false
    }
  } catch {
    saveMessage.value = 'Gagal menyimpan profil'
    saveSuccess.value = false
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  if (user.value) {
    form.name = user.value.name || ''
    form.phone = user.value.phone || ''
  }
  saveMessage.value = ''
}

onMounted(async () => {
  const saved = localStorage.getItem('user')
  if (saved) {
    user.value = JSON.parse(saved)
  }
  // Fetch fresh user data from API
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/users/${user.value.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success && data.data) {
      user.value = data.data
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      const merged = { ...stored, phone: data.data.phone, avatar: data.data.avatar }
      localStorage.setItem('user', JSON.stringify(merged))
    }
  } catch {}
  form.name = user.value?.name || ''
  form.phone = user.value?.phone || ''
})
</script>
