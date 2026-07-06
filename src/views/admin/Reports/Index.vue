<template>
  <DashboardLayout title="Laporan Keuangan" subtitle="REKAPITULASI BAGI HASIL">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Rekapitulasi Keuangan</h2>
          <p class="text-on-surface-variant font-medium">Laporan bagi hasil pendapatan Spec Camp & Mimount</p>
        </div>

        <div class="flex flex-wrap items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/10 shadow-sm">
          <select v-model="periodMonth" class="bg-transparent border-none text-xs font-bold focus:ring-0 px-2 py-1">
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
          <select v-model="periodYear" class="bg-transparent border-none text-xs font-bold focus:ring-0 px-2 py-1">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <button @click="fetchStats" class="bg-primary text-white px-5 py-2 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">refresh</span>
            Tampilkan
          </button>
          <button @click="exportCSV" :disabled="!transactions.length"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 disabled:opacity-40 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">download</span>
            CSV
          </button>
        </div>
      </div>

      <!-- Settlement Info -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <span class="material-symbols-outlined text-amber-600">info</span>
        <div class="text-xs text-amber-900">
          <span class="font-bold">Periode {{ monthName }} {{ periodYear }}</span> —
          Bagi hasil dibayarkan setiap tanggal <span class="font-bold">10 {{ nextMonthName }} {{ nextYear }}</span>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="stats">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Omzet</span>
            <div class="text-2xl font-bold text-primary">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="text-emerald-700 text-xs font-bold">{{ stats.count }} Transaksi</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Biaya Inventory</span>
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(stats.totalInventoryCost) }}</div>
            <div class="text-blue-500/50 text-xs font-bold">100% untuk Mimount</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Layanan Ekstra</span>
            <div class="text-2xl font-bold text-primary">{{ formatCurrency(stats.totalServiceCost) }}</div>
            <div class="text-on-surface-variant/50 text-xs font-bold">Semua tipe layanan</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-blue-600 text-xs font-bold uppercase tracking-widest">Untuk Mimount</span>
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(stats.totalMimountTotal) }}</div>
            <div class="text-blue-500/50 text-xs font-bold">Termasuk share paket + alat</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-red-600 text-xs font-bold uppercase tracking-widest">Pajak 10%</span>
            <div class="text-2xl font-bold text-red-600">{{ formatCurrency(reportTax) }}</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-orange-600 text-xs font-bold uppercase tracking-widest">Retribusi 5%</span>
            <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(reportLocalFee) }}</div>
          </div>
          <div class="bg-emerald-950 p-5 rounded-xl text-emerald-50 space-y-2">
            <span class="text-emerald-300/60 text-xs font-bold uppercase tracking-widest">Spec Camp (Net)</span>
            <div class="text-2xl font-bold text-emerald-400">{{ formatCurrency(reportSpecCampNet) }}</div>
            <div class="text-emerald-300/40 text-xs font-bold">Pendapatan bersih setelah pajak</div>
          </div>
          <div class="bg-amber-50 p-5 rounded-xl border border-amber-200/50 space-y-2">
            <span class="text-amber-900/60 text-xs font-bold uppercase tracking-widest">Settlement</span>
            <div class="flex items-center gap-2 text-amber-900">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
              <span class="text-lg font-bold">10 {{ nextMonthName }}</span>
            </div>
            <div class="text-amber-700/60 text-xs font-bold">Dibayarkan bulan depan</div>
          </div>
        </div>

        <!-- Daily Chart -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h4 class="text-base font-bold text-on-surface mb-4 font-headline">Tren Pendapatan Harian</h4>
          <apexchart type="bar" height="280" :options="chartOptions" :series="chartSeries"></apexchart>
        </div>

        <!-- Transactions List -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-outline-variant/10">
            <h4 class="text-base font-bold text-on-surface font-headline">Daftar Transaksi</h4>
          </div>
          <div v-if="!transactions.length" class="p-8 text-center text-sm text-on-surface-variant">
            Belum ada transaksi di periode ini.
          </div>
          <div v-else class="divide-y divide-outline-variant/5">
            <div v-for="b in transactions" :key="b.id" class="p-4 flex items-center justify-between hover:bg-surface-container/30 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                  {{ getInitials(b.customerName) }}
                </div>
                <div>
                  <p class="text-xs font-bold text-on-surface">{{ b.customerName }}</p>
                  <p class="text-[9px] text-on-surface-variant">{{ b.PackageEvent?.name || '-' }} • {{ formatDate(b.checkInDate) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-primary">{{ formatCurrency(b.totalPrice) }}</p>
                <span class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      :class="b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : b.status === 'completed' ? 'bg-surface-container-highest text-on-surface-variant' : b.status === 'cancelled' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'">
                  {{ translateStatus(b.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">analytics</span>
        <p class="text-on-surface-variant text-sm">Pilih periode dan klik Tampilkan untuk melihat laporan.</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import { reportService } from '../../../services/reportService'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const now = new Date()
const periodYear = ref(now.getFullYear())
const periodMonth = ref(now.getMonth() + 1)
const loading = ref(false)
const stats = ref(null)
const transactions = ref([])

const months = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
  { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
]

const years = computed(() => {
  const y = now.getFullYear()
  return [y - 2, y - 1, y, y + 1]
})

const monthName = computed(() => months.find(m => m.value === periodMonth.value)?.label || '')
const nextMonth = computed(() => periodMonth.value === 12 ? 1 : periodMonth.value + 1)
const nextYear = computed(() => periodMonth.value === 12 ? periodYear.value + 1 : periodYear.value)
const nextMonthName = computed(() => months.find(m => m.value === nextMonth.value)?.label || '')

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const translateStatus = (s) => {
  const map = { pending: 'Pending', confirmed: 'Confirmed', completed: 'Selesai', cancelled: 'Batal' }
  return map[s] || s
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const exportCSV = () => {
  const rows = [['Tanggal', 'Nama', 'Paket', 'Status', 'Total', 'Mimount', 'Spec Camp']]
  transactions.value.forEach(b => {
    rows.push([
      b.checkInDate,
      b.customerName,
      b.PackageEvent?.name || '-',
      b.status,
      Number(b.totalPrice || 0),
      Number(b.mimountTotal || 0),
      Number(b.specCampShare || 0)
    ])
  })
  // Summary row
  rows.push([])
  rows.push(['TOTAL', '', '', '', stats.value?.totalRevenue || 0, stats.value?.totalMimountTotal || 0, stats.value?.totalSpecCampShare || 0])
  rows.push(['Pajak 10%', '', '', '', '', '', reportTax.value])
  rows.push(['Retribusi Desa 5%', '', '', '', '', '', reportLocalFee.value])
  rows.push(['Net Spec Camp', '', '', '', '', '', reportSpecCampNet.value])

  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-${monthName.value.toLowerCase()}-${periodYear.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const getStartDate = () => {
  return `${periodYear.value}-${String(periodMonth.value).padStart(2, '0')}-01`
}

const getEndDate = () => {
  const d = new Date(periodYear.value, periodMonth.value, 0)
  return `${periodYear.value}-${String(periodMonth.value).padStart(2, '0')}-${d.getDate()}`
}

const reportTax = computed(() => Math.round((stats.value?.totalSpecCampShare || 0) * 0.1))
const reportLocalFee = computed(() => Math.round((stats.value?.totalSpecCampShare || 0) * 0.05))
const reportSpecCampNet = computed(() => Math.max(0, (stats.value?.totalSpecCampShare || 0) - reportTax.value - reportLocalFee.value))

const sortedDailyStats = computed(() => {
  if (!stats.value || !stats.value.daily) return {}
  return Object.keys(stats.value.daily).sort().reduce((acc, key) => {
    acc[key] = stats.value.daily[key]
    return acc
  }, {})
})

const chartSeries = computed(() => [{
  name: 'Spec Camp',
  data: Object.values(sortedDailyStats.value).map(d => Number(d.specCamp))
}, {
  name: 'Mimount',
  data: Object.values(sortedDailyStats.value).map(d => Number(d.mimount))
}])

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Outfit, sans-serif' },
  colors: ['#059669', '#d97706'],
  plotOptions: { bar: { borderRadius: 8, columnWidth: '45%' } },
  xaxis: { categories: Object.keys(sortedDailyStats.value).map(d => formatDate(d)) },
  yaxis: { labels: { formatter: (v) => formatCurrency(v) } },
  tooltip: { y: { formatter: (v) => formatCurrency(v) } }
}))

const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)

const fetchStats = async () => {
  loading.value = true
  try {
    const startDate = getStartDate()
    const endDate = getEndDate()
    const res = await reportService.getFinancial(startDate, endDate)
    if (res.success) stats.value = res.data
    // Fetch raw bookings for transaction list
    const api = (await import('../../../services/api')).default
    const bookingsRes = await api.get('/bookings')
    transactions.value = (bookingsRes.data?.data || []).filter(b => {
      const d = new Date(b.checkInDate)
      return d >= new Date(startDate) && d <= new Date(endDate)
    }).sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
