<template>
  <DashboardLayout title="Manajemen Reservasi">
    <div class="space-y-3 md:space-y-6 max-w-7xl mx-auto pb-10">
      <!-- Page Header Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h2 class="text-2xl md:text-2xl font-black tracking-tight text-primary font-headline uppercase">Manajemen Reservasi</h2>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium">Kelola jadwal tamu, status, dan pendapatan operasional.</p>
        </div>
        <button @click="openModal()" 
                class="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined mr-2" data-icon="add">add</span>
          Buat Reservasi Baru
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else>
        <!-- Dashboard Stats Bento -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="md:col-span-2 bg-primary text-white p-6 md:p-6 rounded-2xl flex flex-col justify-between overflow-hidden relative shadow-lg shadow-primary/10">
            <div class="z-10">
              <p class="font-label uppercase tracking-widest text-[10px] text-primary-fixed-dim mb-1">Total Pendapatan</p>
              <h2 class="text-2xl md:text-2xl font-black font-headline tracking-tight">{{ formatCurrency(totalRevenue) }}</h2>
            </div>
            <div class="mt-8 flex items-center gap-2 z-10">
              <span class="text-emerald-400 material-symbols-outlined">trending_up</span>
              <span class="text-sm font-medium">Performa berjalan baik</span>
            </div>
            <!-- Decorative Graphic -->
            <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <span class="material-symbols-outlined text-[160px]">mountain_flag</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest border border-outline-variant/10 p-4 md:p-5 rounded-2xl flex flex-col justify-between shadow-sm">
            <p class="font-label uppercase tracking-widest text-[9px] text-on-surface-variant font-black">Reservasi Aktif</p>
            <h3 class="text-2xl md:text-2xl font-black font-headline text-on-surface mt-1">{{ confirmedBookings.length }}</h3>
            <div class="h-1 w-full bg-surface-container rounded-full mt-4">
              <div class="h-1 bg-emerald-600 rounded-full" :style="{ width: ((confirmedBookings.length / (bookings.length || 1)) * 100) + '%' }"></div>
            </div>
          </div>
          <div class="bg-tertiary-container text-white p-4 md:p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-tertiary/10">
            <p class="font-label uppercase tracking-widest text-[9px] text-on-tertiary-container font-black">Menunggu Konfirmasi</p>
            <h3 class="text-2xl md:text-2xl font-black font-headline mt-1">{{ pendingBookings.length }}</h3>
            <button @click="filter = 'pending'" class="mt-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-white/80 transition-colors">
              Lihat Detail <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Booking Management Section -->
        <div class="bg-surface-container-low md:rounded-3xl overflow-hidden">
          <!-- Filters Bar -->
          <div class="bg-surface-container-lowest p-3 md:p-5 border-b border-outline-variant/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 class="text-base font-extrabold font-headline tracking-tight text-on-surface">Daftar Reservasi</h2>
            <div class="flex flex-wrap gap-2">
              <button @click="filter = 'all'" :class="filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'" class="px-4 py-2 rounded-lg text-sm font-bold font-label transition-all active:scale-95">Semua</button>
              <button @click="filter = 'pending'" :class="filter === 'pending' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'" class="px-4 py-2 rounded-lg text-sm font-bold font-label transition-all active:scale-95">Tertunda</button>
              <button @click="filter = 'confirmed'" :class="filter === 'confirmed' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'" class="px-4 py-2 rounded-lg text-sm font-bold font-label transition-all active:scale-95">Dikonfirmasi</button>
              <button @click="filter = 'completed'" :class="filter === 'completed' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'" class="px-4 py-2 rounded-lg text-sm font-bold font-label transition-all active:scale-95">Selesai</button>
            </div>
          </div>

          <!-- Bookings Grid -->
          <div class="p-2 md:p-6 space-y-3 md:space-y-4">
            <!-- Table Header -->
            <div class="hidden md:grid grid-cols-12 gap-4 px-6 mb-2">
              <div class="col-span-3 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Tamu & Kegiatan</div>
              <div class="col-span-1 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest text-center">Jadwal</div>
              <div class="col-span-3 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Paket / Tipe</div>
              <div class="col-span-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest text-center">Total Biaya</div>
              <div class="col-span-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest text-center">Status</div>
              <div class="col-span-1 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest text-right pr-4">Aksi</div>
            </div>

            <!-- Booking List -->
            <div v-for="booking in filteredBookings" :key="booking.id" 
                 class="group bg-surface-container-lowest p-4 md:p-5 rounded-3xl border border-outline-variant/10 transition-all duration-300 hover:shadow-lg hover:border-primary/20 mb-4">
              
              <div class="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-6">
                
                <!-- Tamu & Kegiatan (Mobile Header) -->
                <div class="col-span-3 flex items-center gap-3 w-full">
                  <div class="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 font-black text-xs shrink-0">
                    {{ getInitials(booking.customerName) }}
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-bold text-on-surface text-base md:text-base truncate">{{ booking.customerName }}</h4>
                    <p class="text-xs text-on-surface-variant font-medium flex items-center gap-1.5 mt-0.5">
                      <span class="material-symbols-outlined text-sm">phone_iphone</span> 
                      {{ booking.phone || '-' }}
                    </p>
                    <p v-if="booking.bookingCode" class="text-[9px] text-primary font-bold mt-0.5">
                      #{{ booking.bookingCode }}
                    </p>
                  </div>
                </div>

                <!-- Jadwal (Hidden label on mobile, aligned icon) -->
                <div class="col-span-1 flex md:flex-col items-center gap-2 md:gap-0">
                  <span class="material-symbols-outlined text-sm md:hidden text-on-surface-variant">calendar_month</span>
                  <span class="text-sm font-black text-on-surface">{{ formatShortDate(booking.checkInDate) }}</span>
                  <span class="text-xs font-black text-on-surface">{{ formatShortDate(booking.checkOutDate) }}</span>
                  <span class="text-[9px] text-on-surface-variant uppercase font-bold tracking-tight text-center">
                    {{ calculateDays(booking.checkInDate, booking.checkOutDate) }} Ml
                  </span>
                </div>

                <!-- Paket / Tipe -->
                <div class="col-span-3 w-full">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="bg-amber-100 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      {{ booking.PackageEvent?.name || translateType(booking.type) }}
                    </span>
                    <span class="bg-surface-container text-on-surface-variant text-[9px] font-black px-2 py-0.5 rounded">
                      {{ booking.pax }} Pax
                    </span>
                    <span v-if="booking.PackageEvent?.mimountShare" class="text-[7px] font-bold text-on-surface-variant/60">
                      M:{{ formatCurrency(booking.PackageEvent.mimountShare) }}/ SC:{{ formatCurrency(booking.PackageEvent.pricePerPax - booking.PackageEvent.mimountShare) }}/
                    </span>
                    <span v-for="i in booking.InventoryItems" :key="'inv-'+i.id" 
                          class="text-[7px] font-bold text-blue-600">
                      {{ i.BookingInventory?.quantity }}{{ i.name.slice(0,3) }}
                    </span>
                    <span v-for="s in booking.ExtraServices" :key="'extra-'+s.id" 
                          :class="s.type === 'mimount' ? 'text-blue-600' : s.type === 'eksternal' ? 'text-purple-600' : 'text-emerald-600'" class="text-[7px] font-bold">
                      +{{ s.name.slice(0,4) }}
                    </span>
                  </div>
                </div>

                <!-- Total Biaya -->
                <div class="col-span-2 w-full md:text-center mt-1 md:mt-0">
                  <p class="text-base md:text-base font-black text-primary">{{ formatCurrency(booking.totalPrice) }}</p>
                </div>

                <!-- Status & Aksi (Mobile Footer) -->
                <div class="col-span-3 flex items-center justify-between w-full mt-2 pt-4 border-t border-outline-variant/5 md:border-none md:mt-0 md:pt-0">
                  <!-- Status -->
                  <div class="flex-1 md:flex-none md:col-span-2 flex md:justify-center gap-1.5">
                    <span :class="getStatusBadgeClass(booking.status)" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black rounded-full uppercase tracking-tighter shadow-sm border border-black/5 whitespace-nowrap">
                      <span :class="getStatusDotClass(booking.status)" class="w-1.5 h-1.5 rounded-full"></span>
                      {{ translateStatus(booking.status) }}
                    </span>
                    <span v-if="isBookingSettled(booking)" class="inline-flex items-center gap-1 px-2 py-1.5 text-[9px] font-black rounded-full uppercase tracking-tighter bg-emerald-600 text-white whitespace-nowrap">
                      <span class="material-symbols-outlined text-xs">payments</span>
                      Settled
                    </span>
                  </div>

                    <!-- Aksi -->
                    <div class="flex items-center gap-1">
                      <!-- Status Toggle -->
                      <div class="relative">
                        <button @click.stop="toggleStatus(booking.id)"
                                class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-primary transition-all" title="Ganti Status">
                          <span class="material-symbols-outlined text-lg">published_with_changes</span>
                        </button>
                        <div v-if="statusOpenId === booking.id" @click.stop
                             class="absolute right-0 bottom-full mb-2 bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl p-2 z-[70] min-w-[150px]">
                          <p class="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest px-3 py-1 mb-1 border-b border-outline-variant/5">Ganti Status</p>
                          <button v-for="st in ['pending', 'confirmed', 'completed', 'cancelled']" :key="st"
                                  @click="updateStatus(booking, st)"
                                  class="w-full text-left px-3 py-2 text-[10px] font-bold rounded-xl hover:bg-surface-container transition-all flex items-center justify-between"
                                  :class="booking.status === st ? 'text-primary bg-primary/5' : 'text-on-surface-variant'">
                            {{ translateStatus(st) }}
                            <span v-if="booking.status === st" class="material-symbols-outlined text-sm">check_circle</span>
                          </button>
                        </div>
                      </div>

                      <!-- Lihat Detail -->
                      <button @click="viewDetail(booking)" class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-primary transition-all" title="Detail">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                      </button>

                      <!-- Popover Edit & Hapus -->
                      <div class="relative">
                        <button @click.stop="toggleActions(booking.id)"
                                class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-primary transition-all">
                          <span class="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                        <div v-if="actionsOpenId === booking.id" @click.stop
                             class="absolute right-0 bottom-full mb-2 bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl p-1.5 z-[70] min-w-[150px]">
                          <button @click="openModal(booking); actionsOpenId = null"
                                  class="w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl hover:bg-surface-container transition-all flex items-center gap-2.5 text-on-surface">
                            <span class="material-symbols-outlined text-lg text-primary">edit</span>
                            Ubah
                          </button>
                          <div class="border-t border-outline-variant/10 my-1"></div>
                          <button @click="deleteBooking(booking.id); actionsOpenId = null"
                                  class="w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl hover:bg-error/10 transition-all flex items-center gap-2.5 text-error">
                            <span class="material-symbols-outlined text-lg">delete</span>
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <BookingFormModal v-if="showModal"
        :form="form" :editing-id="editingId" :saving="saving"
        :error-message="errorMessage" :packages="packages"
        :customers="customers" :service-list="serviceList"
        :inventory-list="inventoryList"
        @close="closeModal" @save="saveBooking"
      />

      <!-- Detail Modal -->
      <div v-if="showDetail" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="showDetail = false"></div>
        <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
          <div class="p-6 md:p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-base font-bold text-primary font-headline">Detail Reservasi</h3>
                <p class="text-sm text-on-surface-variant mt-1">Kode Booking: <span class="font-bold">#{{ detailBooking?.bookingCode }}</span></p>
              </div>
              <button @click="showDetail = false" class="text-on-surface-variant hover:text-error transition-colors p-1">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="space-y-4" v-if="detailBooking">
              <!-- Customer -->
              <div class="bg-surface-container rounded-xl p-4">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Data Pemesan</p>
                <p class="text-sm font-bold">{{ detailBooking.customerName }}</p>
                <p class="text-xs text-on-surface-variant">{{ detailBooking.phone }}</p>
              </div>

              <!-- Booking -->
              <div class="bg-surface-container rounded-xl p-4 space-y-1.5">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Detail Pesanan</p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <span class="text-on-surface-variant">Paket:</span>
                  <span class="font-bold text-right">{{ detailBooking.PackageEvent?.name || '-' }}</span>
                  <span class="text-on-surface-variant">Tanggal:</span>
                  <span class="font-bold text-right">{{ detailBooking.checkInDate }} s/d {{ detailBooking.checkOutDate }}</span>
                  <span class="text-on-surface-variant">Jumlah Tamu:</span>
                  <span class="font-bold text-right">{{ detailBooking.pax }} orang <span v-if="detailBooking.freePax > 0" class="text-emerald-600">({{ detailBooking.freePax }} gratis)</span></span>
                  <span class="text-on-surface-variant">Status:</span>
                  <span class="font-bold text-right" :class="detailBooking.status === 'confirmed' ? 'text-emerald-600' : detailBooking.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'">{{ translateStatus(detailBooking.status) }}</span>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="detailBooking.notes" class="bg-surface-container rounded-xl p-4">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Catatan</p>
                <p class="text-xs text-on-surface-variant">{{ detailBooking.notes }}</p>
              </div>

              <!-- Inventory Items -->
              <div v-if="detailBooking.InventoryItems?.length" class="bg-surface-container rounded-xl p-4">
                <p class="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">Peralatan Mimount</p>
                <div v-for="i in detailBooking.InventoryItems" :key="i.id" class="flex justify-between text-xs py-1">
                  <span>{{ i.name }}</span>
                  <span class="font-bold">{{ i.BookingInventory?.quantity }}x {{ formatCurrency(i.BookingInventory?.priceAtBooking || i.price) }}</span>
                </div>
              </div>

              <!-- Services -->
              <div v-if="detailBooking.ExtraServices?.length" class="bg-surface-container rounded-xl p-4">
                <p class="text-[9px] font-bold text-primary uppercase tracking-wider mb-2">Layanan Ekstra</p>
                <div v-for="s in detailBooking.ExtraServices" :key="s.id" class="flex justify-between text-xs py-1">
                  <span>{{ s.name }}</span>
                  <span class="font-bold">{{ s.BookingService?.quantity }}x {{ formatCurrency(s.BookingService?.priceAtBooking || s.price) }}</span>
                </div>
              </div>

              <!-- Payment Proof -->
              <div class="bg-surface-container rounded-xl p-4">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bukti Pembayaran</p>
                <div v-if="detailBooking.paymentProof" class="rounded-lg overflow-hidden border border-outline-variant/10 cursor-pointer" @click="showImagePreview = detailBooking.paymentProof">
                  <img :src="detailBooking.paymentProof" alt="Bukti Pembayaran" class="w-full max-h-64 object-contain bg-white">
                </div>
                <p v-else class="text-xs text-on-surface-variant italic">Belum ada bukti pembayaran</p>
              </div>

              <!-- Revenue -->
              <div class="bg-surface-container rounded-xl p-4">
                <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Pendapatan</p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <span class="text-on-surface-variant">Total:</span>
                  <span class="font-bold text-right text-primary">{{ formatCurrency(detailBooking.totalPrice) }}</span>
                  <span class="text-blue-600">Untuk Mimount:</span>
                  <span class="font-bold text-right text-blue-600">{{ formatCurrency(detailBooking.mimountTotal) }}</span>
                  <span class="text-emerald-600">Net Spec Camp:</span>
                  <span class="font-bold text-right text-emerald-600">{{ formatCurrency(detailBooking.specCampShare) }}</span>
                </div>
                <div v-if="detailBooking.status === 'completed'" class="mt-3 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold">Status Settlement:</span>
                  <span v-if="isBookingSettled(detailBooking)" class="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black rounded-full bg-emerald-600 text-white uppercase tracking-tighter">
                    <span class="material-symbols-outlined text-xs">check_circle</span>
                    Sudah Dibayar
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black rounded-full bg-amber-100 text-amber-800 uppercase tracking-tighter">
                    <span class="material-symbols-outlined text-xs">schedule</span>
                    Belum Dibayar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Preview Lightbox -->
      <div v-if="showImagePreview" class="fixed inset-0 z-[90] overflow-y-auto" @click="showImagePreview = null">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div class="relative min-h-screen flex items-center justify-center p-4">
          <div class="relative max-w-4xl w-full" @click.stop>
            <img :src="showImagePreview" alt="Preview" class="w-full h-auto rounded-2xl">
            <button @click="showImagePreview = null"
                    class="fixed top-4 right-4 w-9 h-9 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-lg hover:bg-surface-container transition-colors z-10">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal 
        :show="showConfirm" 
        :title="confirmTitle" 
        :message="confirmMessage" 
        @confirm="executeDelete" 
        @cancel="showConfirm = false" 
      />
    </DashboardLayout>
  </template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import BookingFormModal from './components/BookingFormModal.vue'
import { bookingService } from '../../../services/bookingService'
import { settlementService } from '../../../services/settlementService'
import api from '../../../services/api'

const loading = ref(true)
const saving = ref(false)
const bookings = ref([])
const packages = ref([])
const customers = ref([])
const serviceList = ref([])
const inventoryList = ref([])
const settlements = ref([])
const showModal = ref(false)
const editingId = ref(null)
const errorMessage = ref('')
const filter = ref('all')

const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const itemToDelete = ref(null)
const statusOpenId = ref(null)
const actionsOpenId = ref(null)
const showDetail = ref(false)
const detailBooking = ref(null)
const showImagePreview = ref(null)

const viewDetail = (booking) => {
  detailBooking.value = booking
  showDetail.value = true
}

const initialForm = {
  type: 'camping',
  packageEventId: '',
  customerId: '',
  customerName: '',
  phone: '',
  checkInDate: '',
  checkOutDate: '',
  pax: 1,
  freePax: 0,
  status: 'pending',
  notes: '',
  totalPrice: 0,
  paymentProof: '',
  sendWhatsapp: false,
  extraServices: [],
  inventoryItems: []
}

const form = ref({ ...initialForm })

// Computed Stats & Filtering
const filteredBookings = computed(() => {
  if (filter.value === 'all') return bookings.value
  return bookings.value.filter(b => b.status === filter.value)
})

const confirmedBookings = computed(() => bookings.value.filter(b => b.status === 'confirmed'))
const pendingBookings = computed(() => bookings.value.filter(b => b.status === 'pending'))
const totalRevenue = computed(() => bookings.value.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + Number(b.totalPrice || 0), 0))

const fetchBookings = async () => {
  loading.value = true
  try {
    const res = await bookingService.getAll()
    bookings.value = res || []
  } catch (err) {
    console.error('Gagal mengambil data reservasi:', err)
  } finally {
    loading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const res = await api.get('/customers')
    customers.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal mengambil data pelanggan:', err)
  }
}

const fetchPackages = async () => {
  try {
    const res = await api.get('/package-events')
    packages.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal mengambil paket kegiatan:', err)
  }
}

const fetchServices = async () => {
  try {
    const res = await api.get('/services')
    serviceList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal mengambil layanan:', err)
  }
}

const fetchInventory = async () => {
  try {
    const res = await api.get('/inventory')
    inventoryList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal mengambil inventory:', err)
  }
}

const fetchSettlements = async () => {
  try {
    const res = await settlementService.getAll()
    settlements.value = res.data || []
  } catch (err) {
    console.error('Gagal mengambil data settlement:', err)
  }
}

const isBookingSettled = (booking) => {
  if (!booking.checkInDate || booking.status !== 'completed') return false
  const d = new Date(booking.checkInDate)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return settlements.value.some(s => s.year === year && s.month === month && s.paidAt)
}

const openModal = (booking = null) => {
  if (booking) {
    editingId.value = booking.id
    form.value = { 
      ...booking,
      checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '',
      checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().split('T')[0] : '',
      extraServices: booking.ExtraServices ? booking.ExtraServices.map(s => ({
        id: s.id,
        quantity: s.BookingService?.quantity || 1
      })) : [],
      inventoryItems: booking.InventoryItems ? booking.InventoryItems.map(i => ({
        id: i.id,
        quantity: i.BookingInventory?.quantity || 1
      })) : []
    }
  } else {
    editingId.value = null
    form.value = JSON.parse(JSON.stringify(initialForm))
  }
  form.value.freePax = form.value.freePax || 0
  showModal.value = true
}

// Watch for package/pax/extraServices/inventoryItems changes to auto-calculate price
watch([() => form.value.packageEventId, () => form.value.pax, () => form.value.freePax, () => form.value.extraServices, () => form.value.inventoryItems], ([newPkgId, newPax, newFreePax, newExtras, newInventory]) => {
  let total = 0
  const freePax = Math.min(newFreePax || 0, Math.max(0, (newPax || 1) - 1))
  const effectivePax = (newPax || 1) - freePax
  if (newPkgId && effectivePax) {
    const pkg = packages.value.find(p => p.id === newPkgId)
    if (pkg) {
      total += Number(pkg.pricePerPax) * effectivePax
    }
  }
  
  if (newExtras && newExtras.length > 0) {
    newExtras.forEach(svc => {
      const item = serviceList.value.find(s => s.id === svc.id)
      if (item) {
        total += Number(item.price) * (Number(svc.quantity) || 1)
      }
    })
  }

  if (newInventory && newInventory.length > 0) {
    newInventory.forEach(inv => {
      const item = inventoryList.value.find(i => i.id === inv.id)
      if (item) {
        total += Number(item.price) * (Number(inv.quantity) || 1)
      }
    })
  }
  
  form.value.totalPrice = total
}, { deep: true })

watch(() => form.value.checkInDate, (date) => {
  if (date && !form.value.checkOutDate) {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    form.value.checkOutDate = d.toISOString().split('T')[0]
  }
})

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  errorMessage.value = ''
}

const saveBooking = async () => {
  saving.value = true
  errorMessage.value = ''
  try {
    const payload = {
      ...form.value,
      extraServices: form.value.extraServices.filter(s => s.id),
      inventoryItems: form.value.inventoryItems.filter(i => i.id)
    }
    if (editingId.value) {
      await bookingService.update(editingId.value, payload)
    } else {
      await bookingService.create(payload)
    }
    await fetchBookings()
    closeModal()
  } catch (err) {
    console.error('Gagal menyimpan reservasi:', err)
    errorMessage.value = err.response?.data?.message || 'Gagal menyimpan data reservasi.'
  } finally {
    saving.value = false
  }
}

const updateStatus = async (booking, newStatus) => {
  if (booking.status === newStatus) return
  statusOpenId.value = null
  
  try {
    await bookingService.update(booking.id, { ...booking, status: newStatus })
    await fetchBookings()
  } catch (err) {
    console.error('Gagal update status:', err)
  }
}

const deleteBooking = (id) => {
  itemToDelete.value = id
  confirmTitle.value = 'Hapus Reservasi'
  confirmMessage.value = 'Apakah Anda yakin ingin menghapus reservasi ini?'
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    await bookingService.delete(itemToDelete.value)
    await fetchBookings()
  } catch (err) {
    console.error('Gagal menghapus reservasi:', err)
  } finally {
    showConfirm.value = false
    itemToDelete.value = null
  }
}

// Helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}

const formatShortDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const calculateDays = (start, end) => {
  if (!start || !end) return 1
  const diffTime = Math.abs(new Date(end) - new Date(start))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 0 ? 1 : diffDays
}

const translateStatus = (status) => {
  const map = {
    pending: 'Tertunda',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  }
  return map[status] || status
}

const translateType = (type) => {
  const map = {
    walk_in: 'Tamu Langsung',
    camping: 'Camping',
    event: 'Gathering',
    tracking: 'Tracking'
  }
  return map[type] || type
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('')
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-emerald-100 text-emerald-900'
    case 'pending': return 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
    case 'completed': return 'bg-surface-container-highest text-on-surface-variant'
    case 'cancelled': return 'bg-error-container text-on-error-container'
    default: return 'bg-surface-container text-on-surface-variant'
  }
}

const getStatusDotClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-emerald-600'
    case 'pending': return 'bg-tertiary'
    case 'completed': return 'bg-on-surface-variant'
    case 'cancelled': return 'bg-error'
    default: return 'bg-on-surface-variant'
  }
}

onMounted(() => {
  fetchBookings()
  fetchPackages()
  fetchCustomers()
  fetchServices()
  fetchInventory()
  fetchSettlements()
  document.addEventListener('click', closeActionsDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionsDropdown)
})

const toggleStatus = (id) => {
  statusOpenId.value = statusOpenId.value === id ? null : id
}

const toggleActions = (id) => {
  actionsOpenId.value = actionsOpenId.value === id ? null : id
}

const closeActionsDropdown = () => {
  statusOpenId.value = null
  actionsOpenId.value = null
}
</script>
