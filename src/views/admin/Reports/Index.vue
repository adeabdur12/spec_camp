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
          <button @click="exportCSV" :disabled="(exportMode === 'single' && !transactions.length) || loading"
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Omzet</span>
            <div class="text-2xl font-bold text-primary">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="text-emerald-700 text-xs font-bold">{{ stats.count }} Transaksi</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-red-600 text-xs font-bold uppercase tracking-widest">Pajak 10%</span>
            <div class="text-2xl font-bold text-red-600">{{ formatCurrency(reportTax) }}</div>
            <div class="text-red-500/50 text-xs font-bold">Ditanggung Spec Camp</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-orange-600 text-xs font-bold uppercase tracking-widest">Retribusi 5%</span>
            <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(reportLocalFee) }}</div>
            <div class="text-orange-500/50 text-xs font-bold">Ditanggung Spec Camp</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-blue-50 border border-blue-200 p-5 rounded-xl space-y-3">
            <span class="text-blue-700 text-xs font-bold uppercase tracking-widest">Porsi Mimount</span>
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-blue-700/60 text-xs font-bold">Layanan Mimount</span>
                <span class="text-blue-900 text-sm font-bold">{{ formatCurrency(stats.mimountServiceCost) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-blue-700/60 text-xs font-bold">Sewa Alat Mimount</span>
                <span class="text-blue-900 text-sm font-bold">{{ formatCurrency(mimountInventoryBase) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-blue-700/60 text-xs font-bold">Porsi Tiket Masuk</span>
                <span class="text-blue-900 text-sm font-bold">{{ formatCurrency(porsiTiketMimount) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-blue-200">
                <span class="text-blue-900 text-xs font-extrabold uppercase">Total Porsi Mimount</span>
                <span class="text-blue-900 text-lg font-extrabold">{{ formatCurrency(totalPorsiMimount) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-3">
            <span class="text-emerald-700 text-xs font-bold uppercase tracking-widest">Porsi Spec Camp</span>
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-emerald-700/60 text-xs font-bold">Markup Inventory</span>
                <span class="text-emerald-900 text-sm font-bold">{{ formatCurrency(inventoryMarkup) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-emerald-700/60 text-xs font-bold">Layanan Spec Camp</span>
                <span class="text-emerald-900 text-sm font-bold">{{ formatCurrency(stats.specCampServiceCost) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-emerald-700/60 text-xs font-bold">Porsi Tiket Masuk</span>
                <span class="text-emerald-900 text-sm font-bold">{{ formatCurrency(porsiTiketSpecCamp) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-emerald-200">
                <span class="text-emerald-900 text-xs font-extrabold uppercase">Total Porsi Spec Camp</span>
                <span class="text-emerald-900 text-lg font-extrabold">{{ formatCurrency(totalPorsiSpecCamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-purple-600 text-xs font-bold uppercase tracking-widest">Layanan Eksternal</span>
            <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(stats.eksternalServiceCost) }}</div>
            <div class="text-purple-500/50 text-xs font-bold">Dipotong sebelum bagi hasil</div>
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
import api from '../../../services/api'
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

  rows.push(['LAPORAN TIKET MASUK SPEC CAMP'])
  rows.push([`Periode: ${monthName.value} ${periodYear.value}`])
  rows.push([`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`])
  rows.push([])

  rows.push(['Tanggal', 'Nama', 'Paket', 'Pax', 'Gratis', 'Status', 'Total', 'Item Type', 'Nama Item', 'Qty', 'Harga/Unit', 'Subtotal', 'Porsi Mimount', 'Porsi Spec Camp', 'Keterangan', 'Tanggal Pembayaran', 'Metode Pembayaran', 'Bukti Pembayaran'])

  let totalRevenue = 0
  let totalInvCost = 0
  let totalMimountTotal = 0
  let totalMimountShare = 0
  let totalSpecCampShare = 0
  let totalMimountSvc = 0
  let totalSpecCampSvc = 0
  let totalEksternalSvc = 0

  transactions.value.forEach(b => {
    const bookingTotal = Number(b.totalPrice || 0)
    totalRevenue += bookingTotal
    totalInvCost += Number(b.inventoryCost || 0)
    totalMimountTotal += Number(b.mimountTotal || 0)
    totalMimountShare += Number(b.mimountShare || 0)
    totalSpecCampShare += Number(b.specCampShare || 0)

    // Booking header row
    rows.push([
      b.checkInDate, b.customerName, b.PackageEvent?.name || '-',
      String(b.pax || 1), String(b.freePax || 0), b.status,
      bookingTotal, '', '', '', '', '', '', '', '',
      b.paidAt ? new Date(b.paidAt).toLocaleDateString('id-ID') : '-', b.paymentMethod || '-', b.paymentProof || '-'
    ])

    // Inventory items detail
    const invItems = b.InventoryItems || []
    invItems.forEach(inv => {
      const price = Number(inv.BookingInventory?.priceAtBooking || inv.price || 0)
      const qty = Number(inv.BookingInventory?.quantity || 1)
      const subtotal = price * qty

      rows.push([
        '', '', '', '', '', '',
        '', 'Inventory', inv.name, String(qty), price, subtotal,
        subtotal, 0, 'Sewa alat Mimount',
        '', '', ''
      ])
    })

    // Services detail
    const services = b.ExtraServices || []
    services.forEach(svc => {
      const price = Number(svc.BookingService?.priceAtBooking || svc.price || 0)
      const qty = Number(svc.BookingService?.quantity || 1)
      const subtotal = price * qty
      const svcType = svc.type || 'spec_camp'
      let paidTo = ''
      let svcMimount = 0
      let svcSpecCamp = 0

      if (svcType === 'mimount') {
        paidTo = 'Mimount'
        svcMimount = subtotal
        totalMimountSvc += subtotal
      } else if (svcType === 'eksternal') {
        paidTo = 'Dipotong (Eksternal)'
        totalEksternalSvc += subtotal
      } else {
        paidTo = 'Spec Camp'
        svcSpecCamp = subtotal
        totalSpecCampSvc += subtotal
      }

      rows.push([
        '', '', '', '', '', '',
        '', `Layanan (${svcType})`, svc.name, String(qty), price, subtotal,
        svcMimount, svcSpecCamp, paidTo,
        '', '', ''
      ])
    })
  })

  // Apply same markup adjustment as ReportService.js
  const mimountInventoryBase = Math.round(totalInvCost / 1.2)
  const specCampInventoryMarkup = totalInvCost - mimountInventoryBase
  const adjustedMimountTotal = totalMimountTotal - specCampInventoryMarkup
  const adjustedSpecCampShare = totalSpecCampShare + specCampInventoryMarkup
  const tax = Math.round(adjustedSpecCampShare * 0.1)
  const fee = Math.round(adjustedSpecCampShare * 0.05)
  const net = Math.max(0, adjustedSpecCampShare - tax - fee)

  const porsiTiketSpecCampSingle = totalSpecCampShare - totalSpecCampSvc

  rows.push([])
  rows.push(['RINGKASAN', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['Total Omzet', '', '', '', '', '', Number(totalRevenue), '', '', '', '', '', '', '', '', '', '', ''])
  rows.push([])
  rows.push(['PENDAPATAN MIMOUNT', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['  Total Layanan Mimount', '', '', '', '', '', '', '', '', '', '', '', Number(totalMimountSvc), '', '', '', '', ''])
  rows.push(['  Total Sewa Alat Mimount', '', '', '', '', '', '', '', '', '', '', '', Number(mimountInventoryBase), '', '', '', '', ''])
  rows.push(['  Total Porsi Tiket Masuk Mimount', '', '', '', '', '', '', '', '', '', '', '', Number(totalMimountShare), '', '', '', '', ''])
  rows.push(['Total Porsi Mimount', '', '', '', '', '', '', '', '', '', '', '', Number(adjustedMimountTotal), '', '', '', '', ''])
  rows.push([])
  rows.push(['PENDAPATAN SPEC CAMP', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['  Total Markup Inventory', '', '', '', '', '', '', '', '', '', '', '', '', Number(specCampInventoryMarkup), '', '', '', ''])
  rows.push(['  Total Layanan Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', Number(totalSpecCampSvc), '', '', '', ''])
  rows.push(['  Total Porsi Tiket Masuk Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', Number(porsiTiketSpecCampSingle), '', '', '', ''])
  rows.push(['Total Porsi Spec Camp (Kotor)', '', '', '', '', '', '', '', '', '', '', '', '', Number(adjustedSpecCampShare), '', '', '', ''])
  rows.push([])
  rows.push(['POTONGAN SPEC CAMP', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['  Pajak 10%', '', '', '', '', '', '', '', '', '', '', '', '', -Number(tax), '', '', '', ''])
  rows.push(['  Retribusi 5%', '', '', '', '', '', '', '', '', '', '', '', '', -Number(fee), '', '', '', ''])
  rows.push(['Net Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', Number(net), '', '', '', ''])
  rows.push([])
  rows.push(['Total Layanan Eksternal (Dipotong)', '', '', '', '', '', '', '', '', '', '', '', '', Number(totalEksternalSvc), '', '', ''])

  const csv = rows.map(r => r.map(v => {
    if (typeof v === 'number') return formatRupiah(v)
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
  const startDate = `${periodYear.value}-${String(periodMonth.value).padStart(2, '0')}-01`
  const endDate = `${exportEndYear.value}-${String(exportEndMonth.value).padStart(2, '0')}-${new Date(exportEndYear.value, exportEndMonth.value, 0).getDate()}`

  const allBookingsRaw = await fetchAllBookings(api)
  const allBookings = allBookingsRaw.filter(b => {
    if (!b.paidAt) return false
    const paidDate = String(b.paidAt).slice(0, 10)
    return paidDate >= startDate && paidDate <= endDate && b.status === 'completed'
  }).sort((a, b) => new Date(a.paidAt) - new Date(b.paidAt))

  const grouped = {}
  allBookings.forEach(b => {
    const d = new Date(b.paidAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(b)
  })

  const rows = []
  let grandTotal = { revenue: 0, invCost: 0, mimountTotal: 0, mimountShare: 0, specCampShare: 0, mimountSvc: 0, specCampSvc: 0, eksternalSvc: 0 }

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

    let monthRevenue = 0
    let monthInvCost = 0
    let monthMimountTotal = 0
    let monthMimountShare = 0
    let monthSpecCampShare = 0
    let monthMimountSvc = 0
    let monthSpecCampSvc = 0
    let monthEksternalSvc = 0

    rows.push([])
    rows.push([`${monthLabel.toUpperCase()} ${y}`])
    rows.push(['Tanggal', 'Nama', 'Paket', 'Pax', 'Gratis', 'Status', 'Total', 'Item Type', 'Nama Item', 'Qty', 'Harga/Unit', 'Subtotal', 'Porsi Mimount', 'Porsi Spec Camp', 'Keterangan', 'Tanggal Pembayaran', 'Metode Pembayaran', 'Bukti Pembayaran'])

    grouped[monthKey].forEach(b => {
      const bookingTotal = Number(b.totalPrice || 0)
      monthRevenue += bookingTotal
      monthInvCost += Number(b.inventoryCost || 0)
      monthMimountTotal += Number(b.mimountTotal || 0)
      monthMimountShare += Number(b.mimountShare || 0)
      monthSpecCampShare += Number(b.specCampShare || 0)

      rows.push([
        b.checkInDate, b.customerName, b.PackageEvent?.name || '-',
        String(b.pax || 1), String(b.freePax || 0), b.status,
        bookingTotal, '', '', '', '', '', '', '', '',
        b.paidAt ? new Date(b.paidAt).toLocaleDateString('id-ID') : '-', b.paymentMethod || '-', b.paymentProof || '-'
      ])

      const invItems = b.InventoryItems || []
      invItems.forEach(inv => {
        const price = Number(inv.BookingInventory?.priceAtBooking || inv.price || 0)
        const qty = Number(inv.BookingInventory?.quantity || 1)
        const subtotal = price * qty

        rows.push([
          '', '', '', '', '', '',
          '', 'Inventory', inv.name, String(qty), price, subtotal,
          subtotal, 0, 'Sewa alat Mimount',
          '', '', ''
        ])
      })

      const services = b.ExtraServices || []
      services.forEach(svc => {
        const price = Number(svc.BookingService?.priceAtBooking || svc.price || 0)
        const qty = Number(svc.BookingService?.quantity || 1)
        const subtotal = price * qty
        const svcType = svc.type || 'spec_camp'
        let paidTo = ''
        let svcMimount = 0
        let svcSpecCamp = 0

        if (svcType === 'mimount') {
          paidTo = 'Mimount'
          svcMimount = subtotal
          monthMimountSvc += subtotal
        } else if (svcType === 'eksternal') {
          paidTo = 'Dipotong (Eksternal)'
          monthEksternalSvc += subtotal
        } else {
          paidTo = 'Spec Camp'
          svcSpecCamp = subtotal
          monthSpecCampSvc += subtotal
        }

        rows.push([
          '', '', '', '', '', '',
          '', `Layanan (${svcType})`, svc.name, String(qty), price, subtotal,
          svcMimount, svcSpecCamp, paidTo,
          '', '', ''
        ])
      })
    })

    // Apply same markup adjustment as ReportService.js
    const mimountInventoryBase = Math.round(monthInvCost / 1.2)
    const specCampInventoryMarkup = monthInvCost - mimountInventoryBase
    const adjustedMimountTotal = monthMimountTotal - specCampInventoryMarkup
    const adjustedSpecCampShare = monthSpecCampShare + specCampInventoryMarkup
    const tax = Math.round(adjustedSpecCampShare * 0.1)
    const fee = Math.round(adjustedSpecCampShare * 0.05)
    const net = Math.max(0, adjustedSpecCampShare - tax - fee)
    const monthPorsiTiketSpecCamp = monthSpecCampShare - monthSpecCampSvc

    grandTotal.revenue += monthRevenue
    grandTotal.invCost += monthInvCost
    grandTotal.mimountTotal += monthMimountTotal
    grandTotal.specCampShare += monthSpecCampShare
    grandTotal.mimountShare += monthMimountShare
    grandTotal.mimountSvc += monthMimountSvc
    grandTotal.specCampSvc += monthSpecCampSvc
    grandTotal.eksternalSvc += monthEksternalSvc

    rows.push([])
    rows.push([`Subtotal ${monthLabel} ${y}`, '', '', '', '', '', monthRevenue, '', '', '', '', '', '', '', '', '', ''])
    rows.push([])
    rows.push(['  PENDAPATAN MIMOUNT', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    rows.push(['    Layanan Mimount', '', '', '', '', '', '', '', '', '', '', '', monthMimountSvc, '', '', '', '', ''])
    rows.push(['    Sewa Alat Mimount', '', '', '', '', '', '', '', '', '', '', '', mimountInventoryBase, '', '', '', '', ''])
    rows.push(['    Porsi Tiket Masuk Mimount', '', '', '', '', '', '', '', '', '', '', '', monthMimountShare, '', '', '', '', ''])
    rows.push(['  Porsi Mimount', '', '', '', '', '', '', '', '', '', '', '', adjustedMimountTotal, '', '', '', '', ''])
    rows.push([])
    rows.push(['  PENDAPATAN SPEC CAMP', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    rows.push(['    Markup Inventory', '', '', '', '', '', '', '', '', '', '', '', '', specCampInventoryMarkup, '', '', '', ''])
    rows.push(['    Layanan Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', monthSpecCampSvc, '', '', '', ''])
    rows.push(['    Porsi Tiket Masuk Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', monthPorsiTiketSpecCamp, '', '', '', ''])
    rows.push(['  Porsi Spec Camp (Kotor)', '', '', '', '', '', '', '', '', '', '', '', '', adjustedSpecCampShare, '', '', '', ''])
    rows.push([])
    rows.push(['  POTONGAN SPEC CAMP', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    rows.push(['    Pajak 10%', '', '', '', '', '', '', '', '', '', '', '', '', -Number(tax), '', '', '', ''])
    rows.push(['    Retribusi 5%', '', '', '', '', '', '', '', '', '', '', '', '', -Number(fee), '', '', '', ''])
    rows.push(['  Net Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', net, '', '', '', ''])
    rows.push([])
    rows.push(['  Layanan Eksternal (Dipotong)', '', '', '', '', '', '', '', '', '', '', '', '', monthEksternalSvc, '', '', ''])
  })

  const totalMimountInventoryBase = Math.round(grandTotal.invCost / 1.2)
  const totalSpecCampInventoryMarkup = grandTotal.invCost - totalMimountInventoryBase
  const totalAdjustedMimount = grandTotal.mimountTotal - totalSpecCampInventoryMarkup
  const totalAdjustedSpecCamp = grandTotal.specCampShare + totalSpecCampInventoryMarkup
  const totalTax = Math.round(totalAdjustedSpecCamp * 0.1)
  const totalFee = Math.round(totalAdjustedSpecCamp * 0.05)
  const totalNet = Math.max(0, totalAdjustedSpecCamp - totalTax - totalFee)

  const grandTotalPorsiTiketSpecCamp = grandTotal.specCampShare - grandTotal.specCampSvc

  rows.push([])
  rows.push(['GRAND TOTAL', '', '', '', '', '', grandTotal.revenue, '', '', '', '', '', '', '', '', '', ''])
  rows.push([])
  rows.push(['PENDAPATAN MIMOUNT', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['  Total Layanan Mimount', '', '', '', '', '', '', '', '', '', '', '', grandTotal.mimountSvc, '', '', '', '', ''])
  rows.push(['  Total Sewa Alat Mimount', '', '', '', '', '', '', '', '', '', '', '', totalMimountInventoryBase, '', '', '', '', ''])
  rows.push(['  Total Porsi Tiket Masuk Mimount', '', '', '', '', '', '', '', '', '', '', '', grandTotal.mimountShare, '', '', '', '', ''])
  rows.push(['Total Porsi Mimount', '', '', '', '', '', '', '', '', '', '', '', totalAdjustedMimount, '', '', '', '', ''])
  rows.push([])
  rows.push(['PENDAPATAN SPEC CAMP', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['  Total Markup Inventory', '', '', '', '', '', '', '', '', '', '', '', '', totalSpecCampInventoryMarkup, '', '', '', ''])
  rows.push(['  Total Layanan Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', grandTotal.specCampSvc, '', '', '', ''])
  rows.push(['  Total Porsi Tiket Masuk Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', grandTotalPorsiTiketSpecCamp, '', '', '', ''])
  rows.push(['Total Porsi Spec Camp (Kotor)', '', '', '', '', '', '', '', '', '', '', '', '', totalAdjustedSpecCamp, '', '', '', ''])
  rows.push([])
  rows.push(['POTONGAN SPEC CAMP', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['  Total Pajak 10%', '', '', '', '', '', '', '', '', '', '', '', '', -Number(totalTax), '', '', '', ''])
  rows.push(['  Total Retribusi 5%', '', '', '', '', '', '', '', '', '', '', '', '', -Number(totalFee), '', '', '', ''])
  rows.push(['Total Net Spec Camp', '', '', '', '', '', '', '', '', '', '', '', '', totalNet, '', '', '', ''])
  rows.push([])
  rows.push(['Total Layanan Eksternal (Dipotong)', '', '', '', '', '', '', '', '', '', '', '', '', grandTotal.eksternalSvc, '', '', ''])

  const csv = rows.map(r => r.map(v => {
    if (typeof v === 'number') return formatRupiah(v)
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
const porsiTiketMimount = computed(() => stats.value?.totalMimountShare || 0)
const totalPorsiMimount = computed(() => porsiTiketMimount.value + mimountInventoryBase.value + (stats.value?.mimountServiceCost || 0))
const porsiTiketSpecCamp = computed(() => Math.max(0, (stats.value?.totalSpecCampShare || 0) - inventoryMarkup.value - (stats.value?.specCampServiceCost || 0)))
const totalPorsiSpecCamp = computed(() => stats.value?.totalSpecCampShare || 0)

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

const formatRupiah = (val) => {
  if (val < 0) return `(${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(-val)})`
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}

const fetchAllBookings = async (api) => {
  const allData = []
  let page = 1
  const limit = 100
  let hasMore = true
  
  while (hasMore) {
    const res = await api.get(`/bookings?page=${page}&limit=${limit}`)
    const data = res.data?.data || []
    allData.push(...data)
    
    if (data.length < limit || !res.data?.pagination?.totalPages || page >= res.data.pagination.totalPages) {
      hasMore = false
    } else {
      page++
    }
  }
  
  return allData
}

const fetchStats = async () => {
  loading.value = true
  try {
    const startDate = getStartDate()
    const endDate = getEndDate()
    const res = await reportService.getFinancial(startDate, endDate)
    if (res.success) stats.value = res.data
    await fetchSettlements()
    // Fetch all bookings for transaction list
    const allBookings = await fetchAllBookings(api)
    transactions.value = allBookings.filter(b => {
      if (!b.paidAt || b.status !== 'completed') return false
      const paidDate = String(b.paidAt).slice(0, 10)
      return paidDate >= startDate && paidDate <= endDate
    }).sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
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
