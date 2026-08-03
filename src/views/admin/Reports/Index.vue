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
          <div class="border-l border-outline-variant/10 pl-2 flex items-center gap-2">
            <select v-model="exportMode" class="bg-transparent border-none text-xs font-bold focus:ring-0 px-2 py-1">
              <option value="single">1 Bulan</option>
              <option value="multi">Multi Bulan</option>
            </select>
            <template v-if="exportMode === 'multi'">
              <span class="text-on-surface-variant text-xs">s/d</span>
              <select v-model="exportEndMonth" class="bg-transparent border-none text-xs font-bold focus:ring-0 px-2 py-1">
                <option v-for="m in months" :key="'end-'+m.value" :value="m.value">{{ m.label }}</option>
              </select>
              <select v-model="exportEndYear" class="bg-transparent border-none text-xs font-bold focus:ring-0 px-2 py-1">
                <option v-for="y in years" :key="'endy-'+y" :value="y">{{ y }}</option>
              </select>
            </template>
          </div>
          <button @click="fetchStats" class="bg-primary text-white px-5 py-2 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">refresh</span>
            Tampilkan
          </button>
          <button @click="exportCSV" :disabled="!transactions.length && exportMode === 'single'"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 disabled:opacity-40 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">download</span>
            CSV
          </button>
        </div>
      </div>

      <!-- Settlement Info -->
      <div :class="currentSettlement ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'" class="border rounded-xl p-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span :class="currentSettlement ? 'material-symbols-outlined text-emerald-600' : 'material-symbols-outlined text-amber-600'">{{ currentSettlement ? 'check_circle' : 'info' }}</span>
          <div :class="currentSettlement ? 'text-emerald-900' : 'text-amber-900'" class="text-xs">
            <template v-if="exportMode === 'multi'">
              <span class="font-bold">{{ monthName }} {{ periodYear }} — {{ endMonthName }} {{ exportEndYear }}</span>
            </template>
            <template v-else>
              <span class="font-bold">Periode {{ monthName }} {{ periodYear }}</span> —
              Bagi hasil dibayarkan setiap tanggal <span class="font-bold">10 {{ nextMonthName }} {{ nextYear }}</span>
              <span v-if="currentSettlement" class="ml-2 font-bold">
                (Dibayar: {{ formatSettlementDate(currentSettlement.paidAt) }})
              </span>
            </template>
          </div>
        </div>
        <button v-if="stats && exportMode === 'single'" @click="toggleSettlement"
                :class="currentSettlement ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'"
                class="px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap">
          <span class="material-symbols-outlined text-sm">{{ currentSettlement ? 'undo' : 'payments' }}</span>
          {{ currentSettlement ? 'Batalkan' : 'Tandai Dibayar' }}
        </button>
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
            <span class="text-blue-600 text-xs font-bold uppercase tracking-widest">Inventory Mimount</span>
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(mimountInventoryBase) }}</div>
            <div class="text-blue-500/50 text-xs font-bold">Harga dasar untuk Mimount</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-emerald-600 text-xs font-bold uppercase tracking-widest">Markup Inventory</span>
            <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(inventoryMarkup) }}</div>
            <div class="text-emerald-500/50 text-xs font-bold">Bagian Spec Camp dari inventory</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-blue-600 text-xs font-bold uppercase tracking-widest">Layanan Mimount</span>
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(stats.mimountServiceCost) }}</div>
            <div class="text-blue-500/50 text-xs font-bold">100% untuk Mimount</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-emerald-600 text-xs font-bold uppercase tracking-widest">Layanan Spec Camp</span>
            <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(stats.specCampServiceCost) }}</div>
            <div class="text-emerald-500/50 text-xs font-bold">100% untuk Spec Camp</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-purple-600 text-xs font-bold uppercase tracking-widest">Layanan Eksternal</span>
            <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(stats.eksternalServiceCost) }}</div>
            <div class="text-purple-500/50 text-xs font-bold">Dipotong sebelum bagi hasil</div>
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
          <div :class="currentSettlement ? 'bg-emerald-50 border-emerald-200/50' : 'bg-amber-50 border-amber-200/50'" class="p-5 rounded-xl border space-y-2">
            <span :class="currentSettlement ? 'text-emerald-900/60' : 'text-amber-900/60'" class="text-xs font-bold uppercase tracking-widest">Settlement</span>
            <div class="flex items-center gap-2" :class="currentSettlement ? 'text-emerald-900' : 'text-amber-900'">
              <span class="material-symbols-outlined text-lg">{{ currentSettlement ? 'check_circle' : 'calendar_month' }}</span>
              <span class="text-lg font-bold">{{ currentSettlement ? 'Dibayar' : '10 ' + nextMonthName }}</span>
            </div>
            <div :class="currentSettlement ? 'text-emerald-700/60' : 'text-amber-700/60'" class="text-xs font-bold">
              {{ currentSettlement ? 'Pembayaran tercatat' : 'Dibayarkan bulan depan' }}
            </div>
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
import { settlementService } from '../../../services/settlementService'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const now = new Date()
const periodYear = ref(now.getFullYear())
const periodMonth = ref(now.getMonth() + 1)
const loading = ref(false)
const stats = ref(null)
const transactions = ref([])
const settlements = ref([])
const exportMode = ref('single')
const exportEndMonth = ref(now.getMonth() + 1)
const exportEndYear = ref(now.getFullYear())

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
const endMonthName = computed(() => months.find(m => m.value === exportEndMonth.value)?.label || '')
const nextMonth = computed(() => periodMonth.value === 12 ? 1 : periodMonth.value + 1)
const nextYear = computed(() => periodMonth.value === 12 ? periodYear.value + 1 : periodYear.value)
const nextMonthName = computed(() => months.find(m => m.value === nextMonth.value)?.label || '')

const currentSettlement = computed(() => {
  return settlements.value.find(s => s.year === periodYear.value && s.month === periodMonth.value && s.paidAt) || null
})

const formatSettlementDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fetchSettlements = async () => {
  try {
    const res = await settlementService.getAll()
    settlements.value = res.data || []
  } catch (e) {
    console.error('Gagal mengambil settlement:', e)
  }
}

const toggleSettlement = async () => {
  try {
    if (currentSettlement.value) {
      await settlementService.unmarkPaid(periodYear.value, periodMonth.value)
    } else {
      await settlementService.markPaid(periodYear.value, periodMonth.value)
    }
    await fetchSettlements()
  } catch (e) {
    console.error('Gagal mengubah status settlement:', e)
  }
}

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

const exportCSV = async () => {
  if (exportMode.value === 'single') {
    exportSingleCSV()
  } else {
    await exportMultiMonthCSV()
  }
}

const exportSingleCSV = () => {
  const rows = []
  
  // Header
  rows.push(['LAPORAN TIKET MASUK SPEC CAMP'])
  rows.push([`Periode: ${monthName.value} ${periodYear.value}`])
  rows.push([`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`])
  rows.push([])
  
  // Data header
  rows.push(['Tanggal', 'Nama', 'Paket', 'Quantity', 'Harga/Pax', 'Sewa Alat', 'Layanan Ekstra', 'Status', 'Total', 'Mimount', 'Spec Camp', 'Deskripsi', 'Bukti Bayar'])
  transactions.value.forEach(b => {
    rows.push([
      b.checkInDate,
      b.customerName,
      b.PackageEvent?.name || '-',
      b.pax || 1,
      b.PackageEvent?.pricePerPax || 0,
      Number(b.inventoryCost || 0),
      Number(b.serviceCost || 0),
      b.status,
      Number(b.totalPrice || 0),
      Number(b.mimountTotal || 0),
      Number(b.specCampShare || 0),
      b.notes || '-',
      b.paymentProof || '-'
    ])
  })
  // Summary row
  rows.push([])
  rows.push(['TOTAL', '', '', '', '', '', '', '', stats.value?.totalRevenue || 0, stats.value?.totalMimountTotal || 0, stats.value?.totalSpecCampShare || 0, '', ''])
  rows.push(['Layanan Mimount', '', '', '', '', '', '', '', '', stats.value?.mimountServiceCost || 0, '', '', ''])
  rows.push(['Layanan Spec Camp', '', '', '', '', '', '', '', '', stats.value?.specCampServiceCost || 0, '', '', ''])
  rows.push(['Layanan Eksternal', '', '', '', '', '', '', '', '', stats.value?.eksternalServiceCost || 0, '', '', ''])
  rows.push(['Markup Inventory (Spec Camp)', '', '', '', '', '', '', '', '', inventoryMarkup.value, '', '', ''])
  rows.push(['Pajak 10%', '', '', '', '', '', '', '', '', reportTax.value, '', '', ''])
  rows.push(['Retribusi Desa 5%', '', '', '', '', '', '', '', '', reportLocalFee.value, '', '', ''])
  rows.push(['Net Spec Camp', '', '', '', '', '', '', '', '', reportSpecCampNet.value, '', '', ''])

  const csv = rows.map(r => r.map(v => {
    if (typeof v === 'number') return v
    return `"${String(v).replace(/"/g, '""')}"`
  }).join(',')).join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-${monthName.value.toLowerCase()}-${periodYear.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const exportMultiMonthCSV = async () => {
  const api = (await import('../../../services/api')).default
  const startDate = `${periodYear.value}-${String(periodMonth.value).padStart(2, '0')}-01`
  const endDate = `${exportEndYear.value}-${String(exportEndMonth.value).padStart(2, '0')}-${new Date(exportEndYear.value, exportEndMonth.value, 0).getDate()}`

  const bookingsRes = await api.get('/bookings')
  const allBookings = (bookingsRes.data?.data || []).filter(b => {
    const d = new Date(b.checkInDate)
    return d >= new Date(startDate) && d <= new Date(endDate) && b.status === 'completed'
  }).sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))

  // Group by month
  const grouped = {}
  allBookings.forEach(b => {
    const d = new Date(b.checkInDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(b)
  })

  const rows = []
  let grandTotal = { revenue: 0, mimount: 0, specCamp: 0, invCost: 0, mimountSvc: 0, specCampSvc: 0, eksternalSvc: 0 }

  // Header
  const startLabel = months.find(m => m.value === periodMonth.value)?.label || ''
  const endLabel = months.find(m => m.value === exportEndMonth.value)?.label || ''
  rows.push(['LAPORAN TIKET MASUK SPEC CAMP'])
  rows.push([`Periode: ${startLabel} ${periodYear.value} - ${endLabel} ${exportEndYear.value}`])
  rows.push([`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`])
  rows.push([])

  const sortedMonths = Object.keys(grouped).sort()
  sortedMonths.forEach(monthKey => {
    const [y, m] = monthKey.split('-').map(Number)
    const monthLabel = months.find(mo => mo.value === m)?.label || ''

    rows.push([])
    rows.push([`${monthLabel.toUpperCase()} ${y}`])
    rows.push(['Tanggal', 'Nama', 'Paket', 'Quantity', 'Harga/Pax', 'Sewa Alat', 'Layanan Ekstra', 'Status', 'Total', 'Mimount', 'Spec Camp', 'Deskripsi', 'Bukti Bayar'])

    const monthStats = { revenue: 0, mimount: 0, specCamp: 0, invCost: 0, mimountSvc: 0, specCampSvc: 0, eksternalSvc: 0 }
    grouped[monthKey].forEach(b => {
      rows.push([
        b.checkInDate,
        b.customerName,
        b.PackageEvent?.name || '-',
        b.pax || 1,
        b.PackageEvent?.pricePerPax || 0,
        Number(b.inventoryCost || 0),
        Number(b.serviceCost || 0),
        b.status,
        Number(b.totalPrice || 0),
        Number(b.mimountTotal || 0),
        Number(b.specCampShare || 0),
        b.notes || '-',
        b.paymentProof || '-'
      ])
      monthStats.revenue += Number(b.totalPrice || 0)
      monthStats.mimount += Number(b.mimountTotal || 0)
      monthStats.specCamp += Number(b.specCampShare || 0)
      monthStats.invCost += Number(b.inventoryCost || 0)
      
      // Calculate service costs by type
      if (b.ExtraServices) {
        b.ExtraServices.forEach(s => {
          const qty = Number(s.BookingService?.quantity || 1)
          const price = Number(s.BookingService?.priceAtBooking || s.price || 0)
          const total = qty * price
          if (s.type === 'mimount') monthStats.mimountSvc += total
          else if (s.type === 'eksternal') monthStats.eksternalSvc += total
          else monthStats.specCampSvc += total
        })
      }
    })

    const invMarkup = Math.round(monthStats.invCost - monthStats.invCost / 1.2)
    const tax = Math.round(monthStats.specCamp * 0.1)
    const fee = Math.round(monthStats.specCamp * 0.05)
    const net = Math.max(0, monthStats.specCamp - tax - fee)

    rows.push([])
    rows.push([`Subtotal ${monthLabel} ${y}`, '', '', '', '', '', '', '', monthStats.revenue, monthStats.mimount, monthStats.specCamp, '', ''])
    rows.push(['  Layanan Mimount', '', '', '', '', '', '', '', '', monthStats.mimountSvc, '', '', ''])
    rows.push(['  Layanan Spec Camp', '', '', '', '', '', '', '', '', monthStats.specCampSvc, '', '', ''])
    rows.push(['  Layanan Eksternal', '', '', '', '', '', '', '', '', monthStats.eksternalSvc, '', '', ''])
    rows.push(['  Markup Inventory', '', '', '', '', '', '', '', '', invMarkup, '', '', ''])
    rows.push(['  Pajak 10%', '', '', '', '', '', '', '', '', tax, '', '', ''])
    rows.push(['  Retribusi 5%', '', '', '', '', '', '', '', '', fee, '', '', ''])
    rows.push(['  Net Spec Camp', '', '', '', '', '', '', '', '', net, '', '', ''])

    grandTotal.revenue += monthStats.revenue
    grandTotal.mimount += monthStats.mimount
    grandTotal.specCamp += monthStats.specCamp
    grandTotal.invCost += monthStats.invCost
    grandTotal.mimountSvc += monthStats.mimountSvc
    grandTotal.specCampSvc += monthStats.specCampSvc
    grandTotal.eksternalSvc += monthStats.eksternalSvc
  })

  const totalInvMarkup = Math.round(grandTotal.invCost - grandTotal.invCost / 1.2)
  const totalTax = Math.round(grandTotal.specCamp * 0.1)
  const totalFee = Math.round(grandTotal.specCamp * 0.05)
  const totalNet = Math.max(0, grandTotal.specCamp - totalTax - totalFee)

  rows.push([])
  rows.push(['GRAND TOTAL', '', '', '', '', '', '', '', grandTotal.revenue, grandTotal.mimount, grandTotal.specCamp, '', ''])
  rows.push(['Total Layanan Mimount', '', '', '', '', '', '', '', '', grandTotal.mimountSvc, '', '', ''])
  rows.push(['Total Layanan Spec Camp', '', '', '', '', '', '', '', '', grandTotal.specCampSvc, '', '', ''])
  rows.push(['Total Layanan Eksternal', '', '', '', '', '', '', '', '', grandTotal.eksternalSvc, '', '', ''])
  rows.push(['Total Markup Inventory', '', '', '', '', '', '', '', '', totalInvMarkup, '', '', ''])
  rows.push(['Total Pajak 10%', '', '', '', '', '', '', '', '', totalTax, '', '', ''])
  rows.push(['Total Retribusi 5%', '', '', '', '', '', '', '', '', totalFee, '', '', ''])
  rows.push(['Total Net Spec Camp', '', '', '', '', '', '', '', '', totalNet, '', '', ''])

  const csv = rows.map(r => r.map(v => {
    if (typeof v === 'number') return v
    return `"${String(v).replace(/"/g, '""')}"`
  }).join(',')).join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-${startLabel.toLowerCase()}-${endLabel.toLowerCase()}-${periodYear.value}-${exportEndYear.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const getStartDate = () => {
  return `${periodYear.value}-${String(periodMonth.value).padStart(2, '0')}-01`
}

const getEndDate = () => {
  if (exportMode.value === 'multi') {
    const d = new Date(exportEndYear.value, exportEndMonth.value, 0)
    return `${exportEndYear.value}-${String(exportEndMonth.value).padStart(2, '0')}-${d.getDate()}`
  }
  const d = new Date(periodYear.value, periodMonth.value, 0)
  return `${periodYear.value}-${String(periodMonth.value).padStart(2, '0')}-${d.getDate()}`
}

const reportTax = computed(() => Math.round((stats.value?.totalSpecCampShare || 0) * 0.1))
const reportLocalFee = computed(() => Math.round((stats.value?.totalSpecCampShare || 0) * 0.05))
const reportSpecCampNet = computed(() => Math.max(0, (stats.value?.totalSpecCampShare || 0) - reportTax.value - reportLocalFee.value))
const inventoryMarkup = computed(() => Math.round((stats.value?.totalInventoryCost || 0) - (stats.value?.totalInventoryCost || 0) / 1.2))
const mimountInventoryBase = computed(() => Math.round((stats.value?.totalInventoryCost || 0) / 1.2))

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
    await fetchSettlements()
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

onMounted(async () => {
  await fetchStats()
})
</script>
