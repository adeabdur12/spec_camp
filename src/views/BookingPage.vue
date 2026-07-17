<template>
  <div class="bg-background text-on-background font-body antialiased min-h-screen">
    <header class="bg-surface-container-lowest border-b border-outline-variant/10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="font-headline text-xl font-black text-primary tracking-tight">Booking</h1>
        <router-link to="/" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Kembali
        </router-link>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-6 py-8 md:py-12">
      <div class="flex items-center gap-3 mb-8 pb-6 border-b border-outline-variant/10">
        <img src="/logo/logo.svg" alt="SPEC CAMP Logo" class="h-10 w-auto" />
        <div>
          <span class="font-black text-xl tracking-tighter font-headline text-primary">SPEC CAMP</span>
          <p class="text-[11px] text-on-surface-variant uppercase tracking-wider leading-tight">Sukabumi Prestige Equestrian Center</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
        {{ error }}
      </div>

      <template v-else>
        <!-- Step 1: Pilih Paket -->
        <section class="mb-8">
          <h2 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">1. Pilih Paket</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button v-for="pkg in packages" :key="pkg.id" type="button"
                    @click="form.packageEventId = pkg.id"
                    :class="['relative bg-surface-container-lowest rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md',
                             form.packageEventId === pkg.id ? 'border-primary shadow-md' : 'border-transparent']">
              <div v-if="pkg.isFeatured" class="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-full">Populer</div>
              <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">{{ pkg.category }}</span>
              <h3 class="font-bold text-on-surface text-base mt-1">{{ pkg.name }}</h3>
              <p v-if="pkg.description" class="text-xs text-on-surface-variant mt-1 line-clamp-2">{{ pkg.description }}</p>
              <div v-if="pkg.features?.length" class="flex flex-wrap gap-1 mt-3">
                <span v-for="(f, i) in pkg.features" :key="i"
                      class="text-[8px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">
                  {{ typeof f === 'string' ? f : f.text || f }}
                </span>
              </div>
              <div v-if="pkg.perPerson" class="text-[10px] text-on-surface-variant mt-2 flex items-start gap-1">
                <span class="material-symbols-outlined text-[12px] mt-0.5">person</span>
                <span>{{ pkg.perPerson }}</span>
              </div>
              <div class="mt-4">
                <span class="text-xl font-black text-primary">{{ formatCurrency(pkg.pricePerPax) }}</span>
                <span class="text-[10px] text-on-surface-variant"></span>
              </div>
              <div v-if="pkg.minPax || pkg.maxPax" class="text-[9px] text-on-surface-variant mt-1">
                Min {{ pkg.minPax || 1 }} - Maks {{ pkg.maxPax || 100 }} pax
              </div>
            </button>
          </div>
        </section>

        <!-- Step 2: Detail Pesanan -->
        <section class="mb-8">
          <h2 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">2. Detail Pesanan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Tanggal Check-in *</label>
              <input v-model="form.checkInDate" type="date" required
                     class="w-full bg-surface-container-lowest border border-outline-variant/20 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Tanggal Check-out *</label>
              <input v-model="form.checkOutDate" type="date" required
                     class="w-full bg-surface-container-lowest border border-outline-variant/20 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Jumlah Pax *</label>
              <input v-model.number="form.pax" type="number" min="1" required
                     class="w-full bg-surface-container-lowest border border-outline-variant/20 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            </div>
          </div>
        </section>

        <!-- Step 3: Data Diri -->
        <section class="mb-8">
          <h2 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">3. Data Pemesan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Nama Lengkap *</label>
              <input v-model="form.customerName" type="text" required
                     class="w-full bg-surface-container-lowest border border-outline-variant/20 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                     placeholder="Nama sesuai KTP">
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Nomor WhatsApp *</label>
              <input v-model="form.phone" type="tel" required
                     class="w-full bg-surface-container-lowest border border-outline-variant/20 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                     placeholder="0812xxxxxx">
            </div>
          </div>
        </section>

        <!-- Step 4: Tambahan -->
        <section class="mb-8">
          <h2 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">4. Tambahan (Opsional)</h2>

          <!-- Sewa Alat -->
          <div class="mb-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Sewa Alat Camping</h3>
            
            <div class="relative mb-3">
              <div class="flex gap-2 items-center">
                <div class="relative flex-1">
                  <input v-model="invSearch" type="text" placeholder="Cari & pilih alat..."
                         class="w-full bg-surface-container border-none px-3 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                         @focus="invOpen = true" @blur="setTimeout(() => invOpen = false, 200)" @input="newInventoryId = ''">
                  <div v-if="invOpen && filteredInventory.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                    <button v-for="item in filteredInventory" :key="item.id" type="button"
                            @click="selectInventory(item)"
                            class="w-full text-left px-3 py-2.5 text-sm hover:bg-surface-container transition-colors flex items-center justify-between">
                      <span class="font-medium">{{ item.name }}</span>
                      <span class="text-[10px] text-on-surface-variant">{{ formatCurrency(item.price) }}/{{ item.unit || 'unit' }}</span>
                    </button>
                  </div>
                  <div v-if="invOpen && invSearch && filteredInventory.length === 0" class="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-xl z-20 p-3 text-xs text-on-surface-variant text-center">
                    Alat tidak ditemukan
                  </div>
                </div>
                <input v-model.number="newInventoryQty" type="number" min="1" placeholder="Jml"
                       class="w-16 bg-surface-container border-none px-2 py-2.5 rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-primary/20"
                       :disabled="!newInventoryId">
                <button @click="addInventoryItem" :disabled="!newInventoryId || !newInventoryQty"
                        class="bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all shrink-0 whitespace-nowrap">
                  + Tambah
                </button>
              </div>
            </div>

            <div v-if="selectedInventory.length === 0" class="text-xs text-on-surface-variant/50 text-center py-3 bg-surface-container rounded-xl">
              Belum ada alat dipilih
            </div>
            <div v-else class="space-y-2">
              <div v-for="(item, idx) in selectedInventory" :key="idx"
                   class="flex items-center gap-3 bg-surface-container p-3 rounded-xl">
                <span class="flex-1 text-sm font-medium text-on-surface">{{ item.name }}</span>
                <span class="text-xs font-bold text-primary">{{ formatCurrency(item.price) }} x {{ item.qty }}</span>
                <button @click="removeInventoryItem(idx)" class="text-error hover:bg-error/10 p-1 rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Layanan -->
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Layanan Tambahan</h3>

            <div class="relative mb-3">
              <div class="flex gap-2 items-center">
                <div class="relative flex-1">
                  <input v-model="svcSearch" type="text" placeholder="Cari & pilih layanan..."
                         class="w-full bg-surface-container border-none px-3 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                         @focus="svcOpen = true" @blur="setTimeout(() => svcOpen = false, 200)" @input="newServiceId = ''">
                  <div v-if="svcOpen && filteredServices.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                    <button v-for="svc in filteredServices" :key="svc.id" type="button"
                            @click="selectService(svc)"
                            class="w-full text-left px-3 py-2.5 text-sm hover:bg-surface-container transition-colors flex items-center justify-between">
                      <span class="font-medium">{{ svc.name }}</span>
                      <span class="text-[10px] text-on-surface-variant">{{ formatCurrency(svc.price) }}/{{ svc.unit || 'orang' }}</span>
                    </button>
                  </div>
                  <div v-if="svcOpen && svcSearch && filteredServices.length === 0" class="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-xl z-20 p-3 text-xs text-on-surface-variant text-center">
                    Layanan tidak ditemukan
                  </div>
                </div>
                <input v-model.number="newServiceQty" type="number" min="1" placeholder="Jml"
                       class="w-16 bg-surface-container border-none px-2 py-2.5 rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-primary/20"
                       :disabled="!newServiceId">
                <button @click="addServiceItem" :disabled="!newServiceId || !newServiceQty"
                        class="bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all shrink-0 whitespace-nowrap">
                  + Tambah
                </button>
              </div>
            </div>

            <div v-if="selectedServices.length === 0" class="text-xs text-on-surface-variant/50 text-center py-3 bg-surface-container rounded-xl">
              Belum ada layanan dipilih
            </div>
            <div v-else class="space-y-2">
              <div v-for="(svc, idx) in selectedServices" :key="idx"
                   class="flex items-center gap-3 bg-surface-container p-3 rounded-xl">
                <span class="flex-1 text-sm font-medium text-on-surface">{{ svc.name }}</span>
                <span class="text-xs font-bold text-primary">{{ formatCurrency(svc.price) }} x {{ svc.qty }}</span>
                <button @click="removeServiceItem(idx)" class="text-error hover:bg-error/10 p-1 rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Cari Pesanan -->
        <div class="text-center border-t border-outline-variant/10 pt-6 mt-6">
          <p class="text-xs text-on-surface-variant mb-2">Sudah punya kode booking?</p>
          <router-link to="/search-booking"
                       class="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80 transition-colors">
            <span class="material-symbols-outlined text-sm">search</span>
            Cari Pesanan Saya
          </router-link>
        </div>

        <!-- Step 5: Ringkasan & Submit -->
        <section class="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-outline-variant/10 -mx-6 px-6 py-4 md:-mx-12 md:px-12">
          <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p v-if="pkgTotal > 0" class="text-xs text-on-surface-variant">Total</p>
              <p v-if="pkgTotal > 0" class="text-xl font-black text-primary">{{ formatCurrency(pkgTotal) }}</p>
              <p v-else class="text-xs text-on-surface-variant">Lengkapi data untuk melihat total</p>
            </div>
            <button type="button" @click="submitBooking" :disabled="!submittable || submitting"
                    class="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20">
              <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ submitting ? 'Memproses...' : 'Pesan Sekarang' }}
            </button>
          </div>
          <div v-if="submitError" class="mt-3 bg-error-container text-on-error-container p-3 rounded-xl text-xs font-medium">{{ submitError }}</div>
        </section>

        <!-- Summary detail -->
        <section v-if="submittable" class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
          <h2 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">Ringkasan Biaya</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Paket</span>
              <span class="font-medium text-on-surface">{{ selectedPackage?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Durasi</span>
              <span class="font-medium text-on-surface">{{ form.checkInDate }} s/d {{ form.checkOutDate }} ({{ nights }} malam)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Jumlah Pax</span>
              <span class="font-medium text-on-surface">{{ form.pax }} pax</span>
            </div>
            <div class="border-t border-outline-variant/10 pt-2 mt-2 space-y-1">
              <div class="flex justify-between text-xs">
                <span class="text-on-surface-variant">{{ selectedPackage?.name }} ({{ formatCurrency(selectedPackage?.pricePerPax) }} x {{ form.pax }})</span>
                <span class="font-bold text-on-surface">{{ formatCurrency(Number(selectedPackage?.pricePerPax) * form.pax) }}</span>
              </div>
              <div v-for="(item, idx) in selectedInventory" :key="'inv-'+idx" class="flex justify-between text-xs">
                <span class="text-on-surface-variant">{{ item.name }} ({{ formatCurrency(item.price) }} x {{ item.qty }})</span>
                <span class="font-bold text-blue-600">{{ formatCurrency(item.price * item.qty) }}</span>
              </div>
              <div v-for="(svc, idx) in selectedServices" :key="'svc-'+idx" class="flex justify-between text-xs">
                <span class="text-on-surface-variant">{{ svc.name }} ({{ formatCurrency(svc.price) }} x {{ svc.qty }})</span>
                <span class="font-bold text-primary">{{ formatCurrency(svc.price * svc.qty) }}</span>
              </div>
            </div>
            <div class="border-t border-outline-variant/10 pt-3 flex justify-between text-base">
              <span class="font-black text-on-surface uppercase">Total</span>
              <span class="font-black text-primary text-lg">{{ formatCurrency(pkgTotal) }}</span>
            </div>
          </div>
        </section>

        <!-- Success -->
        <div v-if="success" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <span class="material-symbols-outlined text-5xl text-emerald-600 mb-3">check_circle</span>
          <h2 class="font-headline text-2xl font-black text-emerald-800 mb-2">Pemesanan Berhasil!</h2>
          <p class="text-emerald-700 text-sm mb-2">Kode Booking: <span class="font-bold">#{{ bookingCode }}</span></p>
          <p class="text-emerald-600 text-xs mb-6">Simpan kode booking untuk cek status dan upload bukti bayar.</p>

          <div class="bg-white rounded-xl p-4 mb-4 text-left border border-emerald-200">
            <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">location_on</span>
              Lokasi Spec Camp
            </h4>
            <p class="text-xs text-emerald-700 mb-2">Sukabumi Prestige Equestrian Center</p>
            <a href="https://maps.app.goo.gl/CSVCFhcjedwDrpN97" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors">
              <span class="material-symbols-outlined text-sm">map</span>
              Buka Google Maps
            </a>
          </div>

          <router-link :to="'/search-booking?code=' + bookingCode"
                       class="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
            Lanjut ke Pembayaran
          </router-link>
        </div>
      </template>
    </div>

    <footer class="border-t border-outline-variant/10 py-6 text-center text-[10px] text-on-surface-variant">
      &copy; {{ new Date().getFullYear() }} Spec Camp. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { packageService } from '../services/packageService'
import { bookingService } from '../services/bookingService'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const packages = ref([])
const submitting = ref(false)
const submitError = ref('')
const success = ref(false)
const bookingCode = ref('')

const form = ref({
  packageEventId: null,
  checkInDate: '',
  checkOutDate: '',
  pax: 1,
  customerName: '',
  phone: ''
})

const inventoryItems = ref([])
const publicServices = ref([])
const selectedInventory = ref([])
const selectedServices = ref([])
const newInventoryId = ref('')
const newInventoryQty = ref(1)
const newServiceId = ref('')
const newServiceQty = ref(1)
const invSearch = ref('')
const svcSearch = ref('')
const invOpen = ref(false)
const svcOpen = ref(false)

const filteredInventory = computed(() => {
  const q = invSearch.value.toLowerCase().trim()
  if (!q) return inventoryItems.value
  return inventoryItems.value.filter(i => i.name.toLowerCase().includes(q))
})

const filteredServices = computed(() => {
  const q = svcSearch.value.toLowerCase().trim()
  if (!q) return publicServices.value
  return publicServices.value.filter(s => s.name.toLowerCase().includes(q))
})

const addInventoryItem = () => {
  const item = inventoryItems.value.find(i => i.id === Number(newInventoryId.value))
  if (!item) return
  selectedInventory.value.push({ id: item.id, name: item.name, price: Number(item.price), qty: newInventoryQty.value || 1 })
  newInventoryId.value = ''
  newInventoryQty.value = 1
  invSearch.value = ''
}

const selectInventory = (item) => {
  newInventoryId.value = item.id
  invSearch.value = item.name
  invOpen.value = false
}

const removeInventoryItem = (idx) => {
  selectedInventory.value.splice(idx, 1)
}

const addServiceItem = () => {
  const svc = publicServices.value.find(s => s.id === Number(newServiceId.value))
  if (!svc) return
  selectedServices.value.push({ id: svc.id, name: svc.name, price: Number(svc.price), qty: newServiceQty.value || 1, type: svc.type })
  newServiceId.value = ''
  newServiceQty.value = 1
  svcSearch.value = ''
}

const selectService = (svc) => {
  newServiceId.value = svc.id
  svcSearch.value = svc.name
  svcOpen.value = false
}

const removeServiceItem = (idx) => {
  selectedServices.value.splice(idx, 1)
}

const selectedPackage = computed(() => {
  return packages.value.find(p => p.id === form.value.packageEventId)
})

const nights = computed(() => {
  if (!form.value.checkInDate || !form.value.checkOutDate) return 0
  const diff = new Date(form.value.checkOutDate) - new Date(form.value.checkInDate)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
})

const pkgTotal = computed(() => {
  if (!selectedPackage.value || !form.value.pax) return 0
  const pkg = Number(selectedPackage.value.pricePerPax) * form.value.pax
  const invTotal = selectedInventory.value.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const svcTotal = selectedServices.value.reduce((sum, s) => sum + (s.price * s.qty), 0)
  return pkg + invTotal + svcTotal
})

const mimountTotal = computed(() => {
  if (!selectedPackage.value || !form.value.pax) return 0
  return Number(selectedPackage.value.mimountShare) * form.value.pax
})

const taxAmount = computed(() => {
  const specShare = pkgTotal.value - mimountTotal.value
  return Math.round(Math.max(0, specShare) * 0.1)
})

const localFeeAmount = computed(() => {
  const specShare = pkgTotal.value - mimountTotal.value
  return Math.round(Math.max(0, specShare) * 0.05)
})

const submittable = computed(() => {
  return form.value.packageEventId && form.value.checkInDate && form.value.checkOutDate &&
         form.value.pax > 0 && form.value.customerName && form.value.phone
})

const whatsappUrl = computed(() => {
  if (!bookingCode.value) return '#'
  const msg = `Halo Spec Camp, saya已有 pesan dengan:\nKode Booking: #${bookingCode.value}\nNama: ${form.value.customerName}\nPaket: ${selectedPackage.value?.name}\nTotal: Rp ${pkgTotal.value.toLocaleString('id-ID')}\n\nMohon konfirmasi.`
  return `https://wa.me/628119899868?text=${encodeURIComponent(msg)}`
})

const fetchPackages = async () => {
  loading.value = true
  try {
    const data = await packageService.getAll()
    packages.value = (data || []).filter(p => p.isActive !== false)
  } catch (e) {
    error.value = 'Gagal memuat paket. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const fetchInventory = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/inventory`)
    const data = await res.json()
    inventoryItems.value = (data.data || []).filter(i => i.isAvailable !== false)
  } catch {}
}

const fetchPublicServices = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/services?public=1`)
    const data = await res.json()
    publicServices.value = data.data || []
  } catch {}
}

const submitBooking = async () => {
  submitting.value = true
  submitError.value = ''

  const extraServices = selectedServices.value.map(s => ({ id: s.id, quantity: s.qty }))
  const inventoryItemsPayload = selectedInventory.value.map(i => ({ id: i.id, quantity: i.qty }))

  try {
    const res = await bookingService.create({
      type: 'camping',
      packageEventId: form.value.packageEventId,
      customerName: form.value.customerName,
      phone: form.value.phone,
      checkInDate: form.value.checkInDate,
      checkOutDate: form.value.checkOutDate,
      pax: form.value.pax,
      status: 'pending',
      sendWhatsapp: true,
      extraServices: extraServices.length > 0 ? extraServices : undefined,
      inventoryItems: inventoryItemsPayload.length > 0 ? inventoryItemsPayload : undefined
    })
    const booking = res.data?.data || res.data
    bookingCode.value = booking?.bookingCode || booking?.id
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      router.push('/search-booking?code=' + bookingCode.value)
    }, 2000)
  } catch (e) {
    submitError.value = e.response?.data?.message || 'Gagal memproses booking.'
  } finally {
    submitting.value = false
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}

onMounted(() => {
  fetchPackages()
  fetchInventory()
  fetchPublicServices()
})

watch(() => form.value.checkInDate, (date) => {
  if (date && !form.value.checkOutDate) {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    form.value.checkOutDate = d.toISOString().split('T')[0]
  }
})
</script>
