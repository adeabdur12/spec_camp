<template>
  <div class="bg-background text-on-background font-body antialiased min-h-screen">
    <header class="bg-surface-container-lowest border-b border-outline-variant/10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/logo/logo.svg" alt="SPEC CAMP Logo" class="h-8 w-auto" />
          <h1 class="font-headline text-lg font-black text-primary tracking-tight">Dashboard Affiliate</h1>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-on-surface-variant font-bold hidden sm:block">{{ affiliate?.name || '-' }}</span>
          <router-link to="/" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">home</span>
            Beranda
          </router-link>
          <button @click="logout" class="text-xs font-bold text-error hover:opacity-80 transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">logout</span>
            Keluar
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-6 py-8 md:py-12">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="!referrer" class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <p class="text-on-surface-variant text-sm mb-4">Sesi berakhir atau data tidak ditemukan.</p>
        <router-link to="/affiliate" class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all inline-flex items-center gap-2">
          Masuk / Daftar
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <!-- Referral Link -->
        <div class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-on-primary">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-on-primary/70">Link Referral Kamu</p>
              <p class="font-bold font-mono text-sm md:text-base break-all mt-1">{{ link }}</p>
              <p class="text-[10px] text-on-primary/70 mt-1.5">Bagikan link ini — tamu yang memesan lewat link ini memberi kamu komisi.</p>
            </div>
            <button @click="copyLink" class="shrink-0 bg-white text-primary px-5 py-3 rounded-xl font-bold text-xs hover:opacity-90 transition-all active:scale-95 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">{{ copied ? 'check' : 'content_copy' }}</span>
              {{ copied ? 'Link Tersalin' : 'Salin Link' }}
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 space-y-1.5">
            <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Total Komisi</span>
            <div class="text-xl font-black text-primary">{{ formatCurrency(s.total) }}</div>
            <div class="text-[10px] text-on-surface-variant font-medium">{{ s.totalBookings }} booking</div>
          </div>
          <div class="bg-emerald-50 rounded-2xl p-5 space-y-1.5">
            <span class="text-emerald-700/60 text-[10px] font-bold uppercase tracking-widest">Komisi Selesai</span>
            <div class="text-xl font-black text-emerald-700">{{ formatCurrency(s.completedTotal) }}</div>
            <div class="text-[10px] text-emerald-700/60 font-medium">{{ s.completedBookings }} booking selesai</div>
          </div>
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 space-y-1.5">
            <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Komisi Menunggu</span>
            <div class="text-xl font-black text-secondary">{{ formatCurrency(s.total - s.completedTotal) }}</div>
            <div class="text-[10px] text-on-surface-variant font-medium">Booking belum selesai</div>
          </div>
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 space-y-1.5">
            <span class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Total Booking</span>
            <div class="text-xl font-black text-primary">{{ s.totalBookings }}</div>
            <div class="text-[10px] text-on-surface-variant font-medium">Booking referral kamu</div>
          </div>
        </div>

        <!-- Monthly Breakdown -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-outline-variant/10">
            <h4 class="text-sm font-bold text-on-surface font-headline">Rekap Bulanan</h4>
          </div>
          <div v-if="!monthly.length" class="p-8 text-center text-sm text-on-surface-variant">Belum ada booking referral.</div>
          <div v-else class="divide-y divide-outline-variant/5">
            <div v-for="m in monthly" :key="m.key" class="flex items-center justify-between p-4">
              <div>
                <p class="text-xs font-bold text-on-surface">{{ m.label }}</p>
                <p class="text-[10px] text-on-surface-variant">{{ m.count }} booking ({{ m.completed }} selesai)</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-black text-primary">{{ formatCurrency(m.total) }}</p>
                <p class="text-[9px] text-on-surface-variant">{{ m.completed }} selesai</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings List -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 class="text-sm font-bold text-on-surface font-headline">Booking Referral</h4>
            <div class="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl">
              <button v-for="opt in statusFilterOptions" :key="opt.value" @click="statusFilter = opt.value"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                      :class="statusFilter === opt.value ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'">
                {{ opt.label }}
              </button>
            </div>
          </div>
          <div v-if="!filteredBookings.length" class="p-8 text-center text-sm text-on-surface-variant">Tidak ada booking pada filter ini.</div>
          <div v-else class="divide-y divide-outline-variant/5">
            <div v-for="b in filteredBookings" :key="b.id" class="p-4 flex items-center justify-between gap-3 hover:bg-surface-container/30 transition-colors">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                  {{ getInitials(b.customerName) }}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-on-surface truncate">{{ b.customerName }}</p>
                  <p class="text-[10px] text-on-surface-variant">
                    <span class="text-on-surface-variant/60 font-mono">#{{ b.bookingCode }}</span> • {{ b.PackageEvent?.name || 'Tanpa paket' }} • {{ formatDate(b.checkInDate) }}
                  </p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="flex items-center justify-end gap-2 mb-1">
                  <span v-for="cls in statusClass(b.status)" :key="cls" :class="cls" class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{{ translateStatus(b.status) }}</span>
                </div>
                <p class="text-xs font-black text-primary">{{ formatCurrency((b.referralMimount || 0) + (b.referralSpecCamp || 0)) }}</p>
                <p class="text-[9px] text-on-surface-variant">Komisi booking ini</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { affiliateService } from '../../services/affiliateService'

const router = useRouter()
const loading = ref(true)
const referrer = ref(null)
const copied = ref(false)
const statusFilter = ref('all')

const statusFilterOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Selesai' }
]

const affiliate = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('aff_user') || '{}')
  } catch {
    return {}
  }
})

const s = computed(() => referrer.value?.summary || { total: 0, totalMimount: 0, totalSpecCamp: 0, totalBookings: 0, completedBookings: 0, completedTotal: 0 })
const bookings = computed(() => referrer.value?.bookings || [])
const link = computed(() => `https://speccamp.site/booking?ref=${referrer.value?.code || referrer.value?.id}`)

const filteredBookings = computed(() => {
  if (statusFilter.value === 'completed') return bookings.value.filter(b => b.status === 'completed')
  if (statusFilter.value === 'active') return bookings.value.filter(b => b.status !== 'completed')
  return bookings.value
})

const monthly = computed(() => {
  const grouped = {}
  bookings.value.forEach(b => {
    const d = new Date(b.checkInDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!grouped[key]) grouped[key] = { key, bookings: [] }
    grouped[key].bookings.push(b)
  })
  return Object.keys(grouped).sort().reverse().map(key => {
    const rows = grouped[key].bookings
    const total = rows.reduce((sum, b) => sum + (Number(b.referralMimount) || 0) + (Number(b.referralSpecCamp) || 0), 0)
    const [y, m] = key.split('-').map(Number)
    const label = new Date(y, m - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    return {
      key,
      label,
      count: rows.length,
      completed: rows.filter(b => b.status === 'completed').length,
      total
    }
  })
})

const copyLink = async () => {
  const url = link.value
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

const logout = () => {
  localStorage.removeItem('aff_token')
  localStorage.removeItem('aff_user')
  router.push('/affiliate')
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const translateStatus = (s) => {
  const map = { pending: 'Pending', confirmed: 'Confirmed', completed: 'Selesai', cancelled: 'Batal' }
  return map[s] || s
}

const statusClass = (status) => {
  const map = {
    completed: ['bg-emerald-100', 'text-emerald-800'],
    confirmed: ['bg-surface-container-highest', 'text-on-surface-variant'],
    cancelled: ['bg-error-container', 'text-on-error-container']
  }
  return map[status] || ['bg-tertiary-fixed', 'text-on-tertiary-fixed-variant']
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0)
}

onMounted(async () => {
  try {
    const res = await affiliateService.getMe()
    referrer.value = res.data?.data || null
    if (referrer.value) localStorage.setItem('aff_user', JSON.stringify(referrer.value))
  } catch (e) {
    console.error('Gagal mengambil dashboard affiliate:', e)
  } finally {
    loading.value = false
  }
})
</script>