<template>
  <div class="bg-background text-on-background font-body antialiased min-h-screen">
    <header class="bg-surface-container-lowest border-b border-outline-variant/10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="font-headline text-xl font-black text-primary tracking-tight">Program Affiliate</h1>
        <router-link to="/" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Kembali
        </router-link>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-6 py-8 md:py-14">
      <div class="flex items-center gap-3 mb-8 pb-6 border-b border-outline-variant/10">
        <img src="/logo/logo.svg" alt="SPEC CAMP Logo" class="h-10 w-auto" />
        <div>
          <span class="font-black text-xl tracking-tighter font-headline text-primary">SPEC CAMP</span>
          <p class="text-[11px] text-on-surface-variant uppercase tracking-wider leading-tight">Sukabumi Prestige Equestrian Center</p>
        </div>
      </div>

      <!-- Intro -->
      <div class="mb-8">
        <h2 class="text-2xl font-black tracking-tight font-headline text-on-surface">Dapatkan komisi dari setiap orang yang kamu ajak camping.</h2>
        <p class="text-sm text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Daftar sebagai affiliate, bagikan link booking unik kamu, dan dapatkan komisi tetap per booking yang diselesaikan.
          Cukup daftar lewat nomor WhatsApp — akun langsung aktif.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <!-- Form Card -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div class="flex p-1.5 gap-1 bg-surface-container-low rounded-t-2xl m-1.5">
            <button @click="mode = 'register'"
                    class="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    :class="mode === 'register' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'">
              Daftar
            </button>
            <button @click="mode = 'login'"
                    class="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    :class="mode === 'login' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'">
              Masuk
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
            <div v-if="mode === 'register'" class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Nama Lengkap</label>
              <input v-model="name" type="text" placeholder="cth: Budi Santoso"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Nomor WhatsApp</label>
              <div class="flex gap-2 items-center">
                <input v-model="phone" type="tel" inputmode="tel" placeholder="08xxxxxxxxxx" :disabled="phoneVerified"
                       class="flex-1 bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body disabled:opacity-60" />
                <button v-if="!phoneVerified" type="button" @click="sendOtp" :disabled="otpSending || !isPhoneValid"
                        class="shrink-0 bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-1.5">
                  <span v-if="otpSending" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                  <span v-else>{{ otpSent ? 'Kirim Ulang' : 'Verifikasi' }}</span>
                </button>
                <span v-else class="shrink-0 bg-emerald-100 text-emerald-700 px-3 py-2.5 rounded-xl text-[10px] font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  Terverifikasi
                </span>
              </div>
              <p v-if="otpError" class="text-xs text-error font-medium">{{ otpError }}</p>
              <p v-if="otpSent && !phoneVerified" class="text-xs text-on-surface-variant">Kode OTP telah dikirim ke {{ phone }}</p>
            </div>

            <!-- OTP Input -->
            <div v-if="otpSent && !phoneVerified" class="flex gap-2 items-center">
              <input v-model="otpCode" type="text" maxlength="6" inputmode="numeric" pattern="[0-9]*"
                     placeholder="Kode OTP" class="bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body text-center tracking-[0.4em]" />
              <button type="button" @click="verifyOtp" :disabled="!otpCode || otpSending"
                      class="shrink-0 bg-secondary text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50">
                Verifikasi
              </button>
              <span v-if="otpTimer > 0" class="text-[10px] text-on-surface-variant">{{ otpTimer }}dt</span>
            </div>

            <button type="submit" :disabled="submitDisabled" class="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              <span v-else>{{ mode === 'register' ? 'Daftar & Aktifkan Akun' : 'Masuk ke Dashboard' }}</span>
            </button>

            <p v-if="error" class="text-xs text-error bg-error-container/40 px-3 py-2 rounded-lg font-medium">{{ error }}</p>
          </form>
        </div>

        <!-- How it works -->
        <div class="space-y-3">
          <div v-for="(s, i) in steps" :key="i" class="flex gap-3 items-start bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4">
            <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">{{ i + 1 }}</div>
            <div>
              <p class="text-xs font-bold text-on-surface font-headline">{{ s.title }}</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">{{ s.desc }}</p>
            </div>
          </div>
          <div class="bg-emerald-50 rounded-xl p-4 flex items-start gap-2.5">
            <span class="material-symbols-outlined text-emerald-600 text-lg mt-0.5">info</span>
            <p class="text-[11px] text-emerald-800 leading-relaxed">
              Komisi dihitung dari booking yang dikaitkan ke link kamu dan dicairkan penuh setelah status booking <span class="font-bold">Selesai</span>.
              Pastikan calon tamu memesan lewat link kamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { affiliateService } from '../../services/affiliateService'

const router = useRouter()
const mode = ref('register')
const name = ref('')
const phone = ref('')
const submitting = ref(false)
const error = ref('')

const otpSent = ref(false)
const otpCode = ref('')
const otpSending = ref(false)
const otpError = ref('')
const otpTimer = ref(0)
let otpTimerInterval = null

const steps = [
  { title: 'Daftar dengan Nomor WhatsApp', desc: 'Masukkan nama dan nomor WhatsApp kamu, lalu verifikasi lewat kode OTP.' },
  { title: 'Bagikan Link Unik Kamu', desc: 'Salin link referral dan bagikan ke teman, keluarga, atau di media sosial.' },
  { title: 'Terima Komisi Per Booking', desc: 'Setiap tamu yang memesan lewat link kamu memberi komisi tetap per booking.' }
]

const isPhoneValid = computed(() => /^08\d{8,12}$/.test(phone.value.trim()) || /^\+62\d{8,13}$/.test(phone.value.trim()))
const phoneVerified = ref(false)
const submitDisabled = computed(() => (mode.value === 'register' && !name.value.trim()) || !phoneVerified.value || submitting.value)

const normalizePhone = (p) => p.trim()

const sendOtp = async () => {
  otpSending.value = true
  otpError.value = ''
  try {
    await api.post('/otp/send', { phone: normalizePhone(phone.value) })
    otpSent.value = true
    otpTimer.value = 60
    if (otpTimerInterval) clearInterval(otpTimerInterval)
    otpTimerInterval = setInterval(() => {
      if (otpTimer.value > 0) otpTimer.value -= 1
      else clearInterval(otpTimerInterval)
    }, 1000)
  } catch (e) {
    otpError.value = e.response?.data?.message || 'Gagal mengirim kode verifikasi.'
  } finally {
    otpSending.value = false
  }
}

const verifyOtp = async () => {
  if (!otpCode.value) return
  otpSending.value = true
  otpError.value = ''
  try {
    await api.post('/otp/verify', { phone: normalizePhone(phone.value), otp: otpCode.value })
    phoneVerified.value = true
    if (otpTimerInterval) clearInterval(otpTimerInterval)
    otpTimer.value = 0
  } catch (e) {
    otpError.value = e.response?.data?.message || 'Kode OTP salah.'
  } finally {
    otpSending.value = false
  }
}

const handleSubmit = async () => {
  if (!phoneVerified.value) {
    error.value = 'Verifikasi nomor WhatsApp terlebih dahulu.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    let res
    if (mode.value === 'register') {
      res = await affiliateService.register({ name: name.value.trim(), phone: normalizePhone(phone.value) })
    } else {
      res = await affiliateService.login({ phone: normalizePhone(phone.value) })
    }
    const data = res.data?.data || {}
    localStorage.setItem('aff_token', data.token)
    localStorage.setItem('aff_user', JSON.stringify(data.referrer || {}))
    router.push('/affiliate/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Terjadi kesalahan. Coba lagi.'
    if (mode.value === 'login' && e.response?.status === 404) {
      mode.value = 'register'
    }
  } finally {
    submitting.value = false
  }
}

onUnmounted(() => {
  if (otpTimerInterval) clearInterval(otpTimerInterval)
})
</script>