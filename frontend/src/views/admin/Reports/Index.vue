<template>
  <DashboardLayout title="Laporan Keuangan" subtitle="REKAPITULASI BAGI HASIL">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline">Rekapitulasi Keuangan</h2>
          <p class="text-on-surface-variant font-medium">Laporan bagi hasil pendapatan Spec Camp & Mimount</p>
        </div>

        <div class="flex flex-wrap items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/10 shadow-sm">
          <div class="flex flex-col px-3 py-1">
            <span class="text-[9px] font-bold uppercase text-on-surface-variant mb-1">Mulai</span>
            <input v-model="filters.startDate" type="date" class="bg-transparent border-none text-xs font-bold focus:ring-0 p-0" />
          </div>
          <div class="w-px h-8 bg-outline-variant/20"></div>
          <div class="flex flex-col px-3 py-1">
            <span class="text-[9px] font-bold uppercase text-on-surface-variant mb-1">Selesai</span>
            <input v-model="filters.endDate" type="date" class="bg-transparent border-none text-xs font-bold focus:ring-0 p-0" />
          </div>
          <button @click="fetchStats" class="bg-primary text-white px-5 py-2 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">refresh</span>
            Perbarui
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="stats">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Total Omzet</span>
            <div class="text-2xl font-bold text-primary">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="text-emerald-700 text-xs font-bold">{{ stats.count }} Transaksi</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Biaya Inventory</span>
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(stats.totalInventoryCost) }}</div>
            <div class="text-emerald-700 text-xs font-bold">100% untuk Mimount</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-red-600 text-xs font-bold uppercase tracking-widest">Pajak 10%</span>
            <div class="text-2xl font-bold text-red-600">{{ formatCurrency(reportTax) }}</div>
            <div class="text-red-500/50 text-xs font-bold">Pajak penghasilan</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-orange-600 text-xs font-bold uppercase tracking-widest">Warga 5%</span>
            <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(reportLocalFee) }}</div>
            <div class="text-orange-500/50 text-xs font-bold">Iuran warga / RT</div>
          </div>
          <div class="bg-emerald-950 p-5 rounded-xl text-emerald-50 space-y-2">
            <span class="text-emerald-300/60 text-xs font-bold uppercase tracking-widest">Spec Camp</span>
            <div class="text-2xl font-bold text-emerald-400">{{ formatCurrency(reportSpecCampNet) }}</div>
            <div class="text-emerald-300/40 text-xs font-bold">Pendapatan bersih setelah pajak</div>
          </div>
          <div class="bg-amber-50 p-5 rounded-xl space-y-2 border border-amber-200/50">
            <span class="text-amber-900/60 text-xs font-bold uppercase tracking-widest">Mimount</span>
            <div class="text-2xl font-bold text-amber-900">{{ formatCurrency(stats.totalMimountTotal) }}</div>
            <div class="text-amber-700/60 text-xs font-bold">Termasuk share paket + alat</div>
          </div>
          <div class="bg-surface-container-low p-5 rounded-xl space-y-2">
            <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Layanan Ekstra</span>
            <div class="text-2xl font-bold text-primary">{{ formatCurrency(stats.totalServiceCost) }}</div>
            <div class="text-emerald-700 text-xs font-bold">Semua tipe layanan</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
            <h4 class="text-base font-bold text-on-surface mb-6 font-headline">Tren Pendapatan Harian</h4>
            <apexchart
              type="bar"
              height="320"
              :options="chartOptions"
              :series="chartSeries"
            ></apexchart>
          </div>

          <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
            <h4 class="text-base font-bold text-on-surface mb-6 font-headline">Distribusi Paket</h4>
            <div v-if="stats.byCategory && Object.keys(stats.byCategory).length > 0" class="space-y-5">
              <div v-for="(data, cat) in stats.byCategory" :key="cat" class="space-y-2">
                <div class="flex justify-between items-end">
                  <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{{ cat }}</span>
                  <span class="text-xs font-bold text-primary">{{ formatCurrency(data.revenue) }}</span>
                </div>
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full transition-all duration-500" :style="{ width: (data.revenue / stats.totalRevenue * 100) + '%' }"></div>
                </div>
                <p class="text-[10px] font-bold text-on-surface-variant/40 text-right">{{ data.count }} Pesanan</p>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <p class="text-sm text-on-surface-variant">Belum ada data distribusi paket.</p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">analytics</span>
        <p class="text-on-surface-variant text-sm">Pilih periode dan klik Perbarui untuk melihat laporan.</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import { reportService } from '../../../services/reportService'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts
const loading = ref(false)
const stats = ref(null)
const filters = ref({ startDate: '', endDate: '' })

const reportTax = computed(() => Math.round((stats.value?.totalSpecCampShare || 0) * 0.1))
const reportLocalFee = computed(() => Math.round((stats.value?.totalSpecCampShare || 0) * 0.05))
const reportSpecCampNet = computed(() => Math.max(0, (stats.value?.totalSpecCampShare || 0) - reportTax.value - reportLocalFee.value))

const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

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

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await reportService.getFinancial(filters.value.startDate, filters.value.endDate)
    if (res.success) stats.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const now = new Date()
  filters.value.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  filters.value.endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().split('T')[0]
  fetchStats()
})
</script>
