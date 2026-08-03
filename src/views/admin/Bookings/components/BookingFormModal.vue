<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Reservasi' : 'Reservasi Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Informasi tamu dan detail jadwal kegiatan</p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="$emit('save')" class="space-y-5">
          <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{{ errorMessage }}</span>
          </div>
          <!-- Booking Type & Customer -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Tipe Reservasi *</label>
                <select v-model="form.type" required
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                  <option value="camping">Camping</option>
                  <option value="walk_in">Tamu Langsung (Walk In)</option>
                  <option value="event">Gathering / Event</option>
                  <option value="tracking">Tracking / Hiking</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Pilih Paket *</label>
                <select v-model="form.packageEventId" required
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                  <option value="" disabled>Pilih Paket Kegiatan</option>
                  <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">{{ pkg.name }} ({{ formatCurrency(pkg.pricePerPax) }})</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Pilih Pelanggan (Opsional)</label>
                <select @change="handleCustomerSelect"
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                  <option value="">-- Tamu Baru --</option>
                  <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Nama Tamu *</label>
                <input v-model="form.customerName" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="Nama Lengkap">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Nomor Telepon/WA *</label>
                <input v-model="form.phone" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="0812...">
              </div>
            </div>

            <div class="flex items-center gap-3 bg-surface-container p-3 rounded-xl">
              <input v-model="form.sendWhatsapp" type="checkbox" id="sendWa"
                     class="w-4 h-4 rounded border-outline-variant/20 text-primary focus:ring-primary/20">
              <label for="sendWa" class="text-xs font-medium text-on-surface-variant cursor-pointer select-none">
                Kirim notifikasi WhatsApp ke tamu
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Jumlah Orang (Pax) *</label>
                <input v-model.number="form.pax" type="number" required min="1"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="1">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Gratis (Free Pax)</label>
                <input v-model.number="form.freePax" type="number" min="0" :max="form.pax - 1"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body text-emerald-600 font-bold"
                       placeholder="0">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Total Harga (Rp) *</label>
                <div class="relative">
                  <input v-model.number="form.totalPrice" type="number" required
                         class="w-full bg-surface-container pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-primary"
                         placeholder="0">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">Rp</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div class="border-t border-outline-variant/10 pt-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3 font-label">Jadwal</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Tanggal Masuk (Check-in) *</label>
                <input v-model="form.checkInDate" type="date" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Tanggal Keluar (Check-out) *</label>
                <input v-model="form.checkOutDate" type="date" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
              </div>
            </div>
          </div>

          <!-- Payment & Status -->
          <div class="border-t border-outline-variant/10 pt-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3 font-label">Status & Pembayaran</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Status Reservasi</label>
                <select v-model="form.status" required
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                  <option value="pending">MENUNGGU (Pending)</option>
                  <option value="confirmed">DIKONFIRMASI (Confirmed)</option>
                  <option value="completed">SELESAI (Completed)</option>
                  <option value="cancelled">DIBATALKAN (Cancelled)</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Tanggal Pembayaran</label>
                <input v-model="form.paidAt" type="date"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Metode Pembayaran</label>
                <select v-model="form.paymentMethod"
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                  <option value="">-- Pilih Metode --</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>
            </div>
            <div class="space-y-1.5 mt-4">
              <label class="text-xs font-medium text-on-surface-variant font-label">Catatan Tambahan</label>
              <textarea v-model="form.notes" rows="2"
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body resize-none"
                        placeholder="Catatan khusus tamu..."></textarea>
            </div>

            <!-- Payment Proof Upload -->
            <div class="mt-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-xs font-bold text-primary uppercase tracking-wider font-label">Bukti Pembayaran</h4>
              </div>

              <div v-if="!form.paymentProof" class="border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center transition-colors cursor-pointer" :class="uploading ? 'opacity-50 pointer-events-none' : 'hover:border-primary/30'" @click="triggerUpload">
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" :disabled="uploading">
                <span class="material-symbols-outlined text-2xl text-on-surface-variant/40 mb-1">{{ uploading ? 'hourglass_top' : 'cloud_upload' }}</span>
                <p class="text-xs font-medium text-on-surface-variant">{{ uploading ? 'Mengupload...' : 'Klik untuk upload bukti bayar' }}</p>
                <p class="text-[9px] text-on-surface-variant/40 mt-0.5">Maks 5MB, format gambar</p>
              </div>

              <div v-else>
                <div class="bg-surface-container rounded-xl overflow-hidden">
                  <img :src="form.paymentProof" alt="Bukti Pembayaran" class="w-full max-h-48 object-contain p-2">
                </div>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">check_circle</span>
                    Bukti pembayaran terupload
                  </p>
                  <button type="button" @click="removePaymentProof"
                          class="text-[10px] font-bold text-error hover:text-error/70 transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">delete</span>
                    Hapus
                  </button>
                </div>
              </div>

              <p v-if="uploadError" class="mt-2 bg-error-container text-on-error-container p-2 rounded-lg text-[10px] font-medium">{{ uploadError }}</p>
            </div>
            <!-- Extra Services Selection -->
            <div class="border-t border-outline-variant/10 pt-4 mt-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-xs font-bold text-primary uppercase tracking-wider font-label">Layanan Ekstra</h4>
                <button type="button" @click="addExtraServiceRow" class="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                  + Tambah Layanan
                </button>
              </div>

              <div v-if="form.extraServices.length === 0" class="text-center py-4 bg-surface-container rounded-xl border border-dashed border-outline-variant/30">
                <p class="text-[10px] text-on-surface-variant">Belum ada layanan ekstra.</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="(svc, index) in form.extraServices" :key="index" class="flex items-center gap-3 bg-surface-container p-3 rounded-xl">
                  <div class="flex-1">
                    <select v-model="svc.id" required
                            class="w-full bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 text-xs">
                      <option value="" disabled>Pilih Layanan</option>
                      <option v-for="item in serviceList" :key="item.id" :value="item.id">
                        {{ item.name }} ({{ formatCurrency(item.price) }}) - {{ item.type === 'mimount' ? 'Mimount' : item.type === 'eksternal' ? 'Eksternal' : 'Spec Camp' }}
                      </option>
                    </select>
                  </div>
                  <div class="w-20">
                    <input v-model.number="svc.quantity" type="number" required min="1"
                           class="w-full bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 text-xs text-center"
                           placeholder="Qty">
                  </div>
                  <button type="button" @click="removeExtraServiceRow(index)" class="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Inventory Selection -->
            <div class="border-t border-outline-variant/10 pt-4 mt-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-xs font-bold text-primary uppercase tracking-wider font-label">Peralatan Mimount</h4>
                <button type="button" @click="addInventoryRow" class="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                  + Tambah Alat
                </button>
              </div>

              <div v-if="form.inventoryItems.length === 0" class="text-center py-4 bg-surface-container rounded-xl border border-dashed border-outline-variant/30">
                <p class="text-[10px] text-on-surface-variant">Belum ada peralatan.</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="(inv, index) in form.inventoryItems" :key="index" class="flex items-center gap-3 bg-surface-container p-3 rounded-xl">
                  <div class="flex-1">
                    <select v-model="inv.id" required
                            class="w-full bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 text-xs">
                      <option value="" disabled>Pilih Alat</option>
                      <option v-for="item in inventoryList" :key="item.id" :value="item.id">
                        {{ item.name }} ({{ formatCurrency(item.price) }})
                      </option>
                    </select>
                  </div>
                  <div class="w-20">
                    <input v-model.number="inv.quantity" type="number" required min="1"
                           class="w-full bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 text-xs text-center"
                           placeholder="Qty">
                  </div>
                  <button type="button" @click="removeInventoryRow(index)" class="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.totalPrice > 0" class="bg-surface-container p-5 rounded-2xl border border-outline-variant/10">
            <h4 class="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Ringkasan Biaya & Bagi Hasil</h4>
            <div class="space-y-2">
              <!-- Package -->
              <div v-if="selectedPackage" class="flex justify-between items-center text-xs">
                <span class="text-on-surface-variant">Paket ({{ formatCurrency(selectedPackage.pricePerPax) }} x {{ form.pax - (form.freePax || 0) }} pax bayar)</span>
                <span class="font-bold text-on-surface">{{ formatCurrency(revenueEstimate.pkgTotal) }}</span>
              </div>
              <div v-if="form.freePax > 0" class="flex justify-between items-center text-xs">
                <span class="text-emerald-600 font-medium">Diskon Free Pax ({{ form.freePax }} orang gratis)</span>
                <span class="font-bold text-emerald-600">- {{ formatCurrency(selectedPackage ? Number(selectedPackage.pricePerPax) * form.freePax : 0) }}</span>
              </div>

              <!-- Inventory -->
              <div v-for="(inv, idx) in inventorySummary" :key="'inv-'+idx" class="flex justify-between items-center text-xs">
                <span class="text-on-surface-variant">
                  <span class="text-blue-600 font-medium">Alat</span> {{ inv.name }} ({{ formatCurrency(inv.price) }} x {{ inv.quantity }})
                </span>
                <span class="font-bold text-blue-600">{{ formatCurrency(inv.price * inv.quantity) }}</span>
              </div>

              <!-- Services -->
              <div v-for="(svc, idx) in extraServicesSummary" :key="'svc-'+idx" class="flex justify-between items-center text-xs">
                <span :class="svc.type === 'mimount' ? 'text-blue-600' : svc.type === 'eksternal' ? 'text-purple-600' : 'text-on-surface-variant'" class="font-medium">
                  {{ svc.name }}
                  <span class="text-[9px] text-on-surface-variant/40">({{ svc.type === 'mimount' ? 'Mimount' : svc.type === 'eksternal' ? 'Eksternal' : 'Spec Camp' }})</span>
                </span>
                <span class="font-bold text-on-surface">{{ formatCurrency(svc.price * svc.quantity) }}</span>
              </div>

              <!-- Total & Split -->
              <div class="pt-2 mt-2 border-t border-outline-variant/10 space-y-1.5">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-black text-on-surface uppercase">Total Pendapatan</span>
                  <span class="text-base font-black text-primary">{{ formatCurrency(form.totalPrice) }}</span>
                </div>
                <div v-if="revenueEstimate.totalSpecCamp > 0" class="pt-1.5 border-t border-outline-variant/5 space-y-1">
                  <div class="flex justify-between text-xs">
                    <span class="font-semibold text-red-500">Pajak 10%</span>
                    <span class="font-bold text-red-500">- {{ formatCurrency(revenueEstimate.tax) }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="font-semibold text-orange-500">Retribusi Desa 5%</span>
                    <span class="font-bold text-orange-500">- {{ formatCurrency(revenueEstimate.localFee) }}</span>
                  </div>
                </div>
                <div class="border-t border-outline-variant/5 space-y-1 pt-1.5">
                  <div class="flex justify-between text-xs">
                    <span class="font-semibold text-blue-700">Untuk Mimount</span>
                    <span class="font-bold text-blue-700">{{ formatCurrency(revenueEstimate.totalMimount) }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="font-semibold text-emerald-700">Net Spec Camp</span>
                    <span class="font-bold text-emerald-700">{{ formatCurrency(revenueEstimate.specCampNet) }}</span>
                  </div>
                  <div v-if="revenueEstimate.totalEksternal > 0" class="flex justify-between text-xs">
                    <span class="font-semibold text-purple-700">Untuk Eksternal</span>
                    <span class="font-bold text-purple-700">{{ formatCurrency(revenueEstimate.totalEksternal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Memproses...' : (editingId ? 'Simpan Perubahan' : 'Buat Reservasi') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import api from '../../../../services/api'

const props = defineProps({
  form: Object,
  editingId: [Number, String],
  saving: Boolean,
  errorMessage: String,
  packages: Array,
  customers: Array,
  serviceList: Array,
  inventoryList: Array
})

const emit = defineEmits(['close', 'save'])
const fileInput = ref(null)
const uploading = ref(false)
const uploadError = ref('')

const selectedPackage = computed(() => {
  if (!props.form.packageEventId) return null
  return props.packages.find(p => p.id === props.form.packageEventId)
})

const extraServicesSummary = computed(() => {
  return props.form.extraServices.map(svc => {
    const item = props.serviceList.find(s => s.id === svc.id)
    return {
      name: item ? item.name : 'Unknown',
      price: item ? Number(item.price) : 0,
      quantity: svc.quantity,
      type: item ? item.type : 'spec_camp'
    }
  }).filter(s => s.price > 0)
})

const inventorySummary = computed(() => {
  return props.form.inventoryItems.map(inv => {
    const item = props.inventoryList.find(i => i.id === inv.id)
    return {
      name: item ? item.name : 'Unknown',
      price: item ? Number(item.price) : 0,
      quantity: inv.quantity,
      type: 'mimount'
    }
  }).filter(i => i.price > 0)
})

const revenueEstimate = computed(() => {
  const pax = props.form.pax || 1
  const freePax = Math.min(props.form.freePax || 0, pax - 1)
  const effectivePax = pax - freePax
  const pkg = selectedPackage.value
  const pkgTotal = pkg ? Number(pkg.pricePerPax) * effectivePax : 0
  const pkgMimount = pkg ? Number(pkg.mimountShare) * effectivePax : 0

  const inventoryCost = inventorySummary.value.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const mimountServices = extraServicesSummary.value.filter(s => s.type === 'mimount').reduce((sum, s) => sum + (s.price * s.quantity), 0)
  const specServices = extraServicesSummary.value.filter(s => s.type === 'spec_camp').reduce((sum, s) => sum + (s.price * s.quantity), 0)
  const eksternalServices = extraServicesSummary.value.filter(s => s.type === 'eksternal').reduce((sum, s) => sum + (s.price * s.quantity), 0)

  const totalMimount = pkgMimount + inventoryCost + mimountServices
  const totalEksternal = eksternalServices
  const totalSpecCamp = Math.max(0, pkgTotal + specServices - pkgMimount)
  const tax = Math.round(totalSpecCamp * 0.1)
  const localFee = Math.round(totalSpecCamp * 0.05)
  const specCampNet = Math.max(0, totalSpecCamp - tax - localFee)

  return {
    pkgTotal,
    pkgMimount,
    inventoryCost,
    mimountServices,
    specServices,
    eksternalServices,
    totalMimount,
    totalEksternal,
    totalSpecCamp,
    tax,
    localFee,
    specCampNet
  }
})

const addExtraServiceRow = () => {
  props.form.extraServices.push({ id: '', quantity: 1 })
}

const removeExtraServiceRow = (index) => {
  props.form.extraServices.splice(index, 1)
}

const addInventoryRow = () => {
  props.form.inventoryItems.push({ id: '', quantity: 1 })
}

const removeInventoryRow = (index) => {
  props.form.inventoryItems.splice(index, 1)
}

const handleCustomerSelect = (event) => {
  const customerId = event.target.value
  if (!customerId) {
    props.form.customerId = ''
    props.form.customerName = ''
    props.form.phone = ''
    return
  }

  const customer = props.customers.find(c => c.id == customerId)
  if (customer) {
    props.form.customerId = customer.id
    props.form.customerName = customer.name
    props.form.phone = customer.phone
  }
}

const triggerUpload = () => fileInput.value?.click()

const handleFileSelect = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const formData = new FormData()
    formData.append('paymentProof', file)
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/upload/payment-proof`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    props.form.paymentProof = data.url
  } catch (e) {
    uploadError.value = e.message || 'Gagal upload bukti bayar.'
  } finally {
    uploading.value = false
  }
}

const removePaymentProof = () => {
  props.form.paymentProof = ''
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}
</script>
