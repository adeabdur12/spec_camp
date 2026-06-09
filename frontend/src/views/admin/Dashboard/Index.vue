<template>
  <DashboardLayout title="Dashboard">
    <div class="space-y-6 max-w-7xl mx-auto pb-10">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-primary font-headline uppercase">Expedition</h2>
          <p class="text-sm text-on-surface-variant font-medium font-body tracking-wide">Ringkasan operasional dan performa bisnis Spec Camp.</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="stats">
        <!-- Dashboard Stats Bento -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="md:col-span-2 bg-primary text-white p-6 rounded-xl flex flex-col justify-between overflow-hidden relative shadow-sm">
            <div class="z-10">
              <p class="font-label uppercase tracking-widest text-[10px] text-primary-fixed-dim mb-1">Omzet Bulan Ini</p>
              <h2 class="text-2xl font-black font-headline tracking-tight">{{ formatCurrency(stats.revenueMonth) }}</h2>
            </div>
            <div class="mt-4 flex items-center gap-2 z-10">
              <span class="text-emerald-400 material-symbols-outlined text-lg">trending_up</span>
              <span class="text-xs font-medium font-body">Performa pendapatan total</span>
            </div>
            <div class="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <span class="material-symbols-outlined text-[100px]">finance_mode</span>
            </div>
          </div>
          
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between">
            <p class="font-label uppercase tracking-widest text-[9px] text-on-surface-variant font-bold">Booking Aktif</p>
            <h3 class="text-2xl font-bold font-headline text-on-surface">{{ stats.activeBookings }}</h3>
          </div>
          
          <div class="bg-tertiary-container text-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <p class="font-label uppercase tracking-widest text-[9px] text-on-tertiary-container font-bold">Total Pelanggan</p>
            <h3 class="text-2xl font-bold font-headline">{{ stats.totalCustomers }}</h3>
            <router-link to="/admin/customers" class="mt-4 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-white/80 transition-colors font-label">
              Lihat Data <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Bookings -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-bold text-on-surface font-headline tracking-tight">Booking Terbaru</h4>
                <router-link to="/admin/bookings" class="text-[9px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2.5 py-1 rounded-lg">
                  Lihat Semua
                </router-link>
              </div>
              
              <div class="space-y-2">
                <div v-for="booking in stats.recentBookings" :key="booking.id" class="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/10 gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold shrink-0 uppercase text-[11px]">
                      {{ getInitials(booking.customerName) }}
                    </div>
                    <div>
                      <p class="text-xs font-bold text-on-surface font-body">{{ booking.customerName }}</p>
                      <p class="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider">{{ booking.PackageEvent?.name || 'Kustom' }}</p>
                    </div>
                  </div>
                  <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto">
                    <p class="text-xs font-bold text-primary">{{ formatCurrency(booking.totalPrice) }}</p>
                    <span :class="getStatusClass(booking.status)" class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block">{{ booking.status }}</span>
                  </div>
                </div>
                <div v-if="!stats.recentBookings || stats.recentBookings.length === 0" class="text-center py-4 text-on-surface-variant text-xs font-medium">
                  Belum ada booking terbaru.
                </div>
              </div>
            </div>

            <!-- Check-ins Today -->
            <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
              <h4 class="text-base font-bold text-on-surface mb-4 font-headline tracking-tight flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-600 bg-amber-100 p-1 rounded-lg text-sm">door_open</span>
                Check-in Hari Ini
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="guest in stats.checkinsToday" :key="guest.id" class="p-3 rounded-xl border border-outline-variant/10 bg-surface-container-low transition-colors hover:bg-surface-container">
                  <p class="text-xs font-bold text-on-surface">{{ guest.customerName }}</p>
                  <p class="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">{{ guest.PackageEvent?.name || 'Kustom' }}</p>
                </div>
                <div v-if="!stats.checkinsToday || stats.checkinsToday.length === 0" class="col-span-1 sm:col-span-2 text-center py-4 text-on-surface-variant text-xs font-medium border border-dashed border-outline-variant/30 rounded-xl">
                  Tidak ada tamu yang check-in hari ini.
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Charts & Alerts -->
          <div class="space-y-6">
            <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
              <h4 class="text-base font-bold text-on-surface mb-4 font-headline tracking-tight">Performa Paket</h4>
              <div class="relative min-h-[220px] flex items-center justify-center">
                <apexchart type="donut" width="100%" height="220" :options="donutOptions" :series="donutSeries"></apexchart>
              </div>
            </div>
            
            <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-bold text-on-surface font-headline tracking-tight flex items-center gap-2">
                  <span class="material-symbols-outlined text-error bg-error-container p-1 rounded-lg text-sm">warning</span>
                  Peringatan Stok
                </h4>
                <span class="bg-error text-on-error text-[9px] font-bold px-2 py-0.5 rounded-full">{{ stats.lowStockCount || 0 }}</span>
              </div>
              
              <div class="space-y-2">
                <div v-for="item in stats.lowStockItems" :key="item.id" class="flex items-center justify-between p-2.5 bg-error-container/30 rounded-lg">
                  <span class="text-[11px] font-bold text-on-surface line-clamp-1 max-w-[150px]">{{ item.name }}</span>
                  <span class="text-[9px] font-black uppercase tracking-wider text-error bg-error/10 px-2 py-0.5 rounded">Sisa {{ item.stock }} {{ item.unit || '' }}</span>
                </div>
                <div v-if="!stats.lowStockItems || stats.lowStockItems.length === 0" class="text-center py-3 text-emerald-600 text-xs font-medium bg-emerald-50 rounded-lg border border-emerald-100">
                  Semua stok aman.
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import { dashboardService } from '../../../services/dashboardService'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts
const loading = ref(true)
const stats = ref(null)

const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'pending': return 'bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-fixed-dim'
    case 'completed': return 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/30'
    case 'cancelled': return 'bg-error-container text-on-error-container border border-error/20'
    default: return 'bg-surface-container text-on-surface-variant'
  }
}

const donutSeries = computed(() => stats.value?.packageDist ? Object.values(stats.value.packageDist) : [])
const donutOptions = computed(() => ({
  chart: { 
    type: 'donut', 
    fontFamily: 'Manrope, sans-serif',
    background: 'transparent'
  },
  labels: Object.keys(stats.value?.packageDist || {}).map(k => k.toUpperCase()),
  colors: ['#2d4b31', '#98ba99', '#fec47f', '#6d3500'],
  stroke: { width: 0 },
  legend: { 
    show: true,
    position: 'bottom',
    fontSize: '9px',
    fontWeight: 'bold',
    fontFamily: 'Epilogue, sans-serif'
  },
  plotOptions: { 
    pie: { 
      donut: { 
        size: '70%',
        labels: { 
          show: true,
          name: {
            fontSize: '9px',
            fontFamily: 'Epilogue, sans-serif',
            fontWeight: 'bold',
          },
          value: {
            fontSize: '18px',
            fontFamily: 'Epilogue, sans-serif',
            fontWeight: '900',
            color: '#2d4b31'
          },
          total: { 
            show: true, 
            label: 'TOTAL DISTRIBUSI',
            fontSize: '8px',
            fontFamily: 'Manrope, sans-serif',
            color: '#737971'
          } 
        } 
      } 
    } 
  },
  dataLabels: {
    enabled: false
  }
}))

const fetchDashboardStats = async () => {
  loading.value = true
  try {
    const res = await dashboardService.getStats()
    if (res.success) stats.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardStats)
</script>
