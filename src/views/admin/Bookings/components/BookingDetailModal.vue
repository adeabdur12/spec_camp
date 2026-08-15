<template>
  <div v-if="booking" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">Detail Reservasi</h3>
            <p class="text-sm text-on-surface-variant mt-1">Kode Booking: <span class="font-bold">#{{ booking.bookingCode }}</span></p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="bg-surface-container rounded-xl p-3 mb-4 flex items-center justify-between gap-2">
          <span class="text-xs text-on-surface-variant truncate">https://speccamp.site/search-booking?code={{ booking.bookingCode }}</span>
          <div class="flex gap-1 shrink-0">
            <button @click="$emit('copy-link', booking)" class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">{{ copiedId === booking.id ? 'check' : 'content_copy' }}</span>
              {{ copiedId === booking.id ? 'Tersalin' : 'Salin' }}
            </button>
            <a :href="'/search-booking?code=' + booking.bookingCode" target="_blank" class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">open_in_new</span>
              Buka
            </a>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Customer -->
          <div class="bg-surface-container rounded-xl p-4">
            <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Data Pemesan</p>
            <p class="text-sm font-bold">{{ booking.customerName }}</p>
            <p class="text-xs text-on-surface-variant">{{ booking.phone }}</p>
          </div>

          <!-- Booking -->
          <div class="bg-surface-container rounded-xl p-4 space-y-1.5">
            <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Detail Pesanan</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <span class="text-on-surface-variant">Paket:</span>
              <span class="font-bold text-right">{{ booking.PackageEvent?.name || '-' }}</span>
              <span class="text-on-surface-variant">Harga Paket:</span>
              <span class="font-bold text-right">{{ formatCurrency(booking.PackageEvent?.pricePerPax) }} /pax</span>
              <span class="text-on-surface-variant">Tanggal:</span>
              <span class="font-bold text-right">{{ booking.checkInDate }} s/d {{ booking.checkOutDate }}</span>
              <span class="text-on-surface-variant">Jumlah Tamu:</span>
              <span class="font-bold text-right">{{ booking.pax }} orang <span v-if="booking.freePax > 0" class="text-emerald-600">({{ booking.freePax }} gratis)</span></span>
              <span class="text-on-surface-variant">Status:</span>
              <span class="font-bold text-right" :class="booking.status === 'confirmed' ? 'text-emerald-600' : booking.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'">{{ translateStatus(booking.status) }}</span>
              <span class="text-on-surface-variant">Metode Bayar:</span>
              <span class="font-bold text-right">{{ booking.paymentMethod === 'qris' ? 'QRIS' : booking.paymentMethod === 'transfer' ? 'Transfer Bank' : '-' }}</span>
              <span class="text-on-surface-variant">Tanggal Bayar:</span>
              <span class="font-bold text-right">{{ booking.paidAt || '-' }}</span>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="booking.notes" class="bg-surface-container rounded-xl p-4">
            <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Catatan</p>
            <p class="text-xs text-on-surface-variant">{{ booking.notes }}</p>
          </div>

          <!-- Inventory Items -->
          <div v-if="booking.InventoryItems?.length" class="bg-surface-container rounded-xl p-4">
            <p class="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">Peralatan Mimount</p>
            <div v-for="i in booking.InventoryItems" :key="i.id" class="flex justify-between text-xs py-1">
              <span>{{ i.name }}</span>
              <span class="font-bold">{{ i.BookingInventory?.quantity }}x {{ formatCurrency(i.BookingInventory?.priceAtBooking || i.price) }}</span>
            </div>
          </div>

          <!-- Services -->
          <div v-if="booking.ExtraServices?.length" class="bg-surface-container rounded-xl p-4">
            <p class="text-[9px] font-bold text-primary uppercase tracking-wider mb-2">Layanan Ekstra</p>
            <div v-for="s in booking.ExtraServices" :key="s.id" class="flex justify-between text-xs py-1">
              <span>{{ s.name }}</span>
              <span class="font-bold">{{ s.BookingService?.quantity }}x {{ formatCurrency(s.BookingService?.priceAtBooking || s.price) }}</span>
            </div>
          </div>

          <!-- Payment Proof -->
          <div class="bg-surface-container rounded-xl p-4">
            <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bukti Pembayaran</p>
            <div v-if="booking.paymentProof" class="rounded-lg overflow-hidden border border-outline-variant/10 cursor-pointer" @click="$emit('preview-image', booking.paymentProof)">
              <img :src="booking.paymentProof" alt="Bukti Pembayaran" class="w-full max-h-64 object-contain bg-white">
            </div>
            <p v-else class="text-xs text-on-surface-variant italic">Belum ada bukti pembayaran</p>
          </div>

          <!-- Revenue -->
          <div class="bg-surface-container rounded-xl p-4">
            <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Pendapatan</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <span class="text-on-surface-variant">Total:</span>
              <span class="font-bold text-right text-primary">{{ formatCurrency(booking.totalPrice) }}</span>
              <span class="text-blue-600">Untuk Mimount:</span>
              <span class="font-bold text-right text-blue-600">{{ formatCurrency(booking.mimountTotal) }}</span>
              <span class="text-emerald-600">Net Spec Camp:</span>
              <span class="font-bold text-right text-emerald-600">{{ formatCurrency(booking.specCampShare) }}</span>
            </div>
            <div v-if="booking.status === 'completed'" class="mt-3 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
              <span class="text-xs text-on-surface-variant font-bold">Status Settlement:</span>
              <span v-if="isSettled" class="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black rounded-full bg-emerald-600 text-white uppercase tracking-tighter">
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
</template>

<script setup>
const props = defineProps({
  booking: { type: Object, default: null },
  isSettled: { type: Boolean, default: false },
  copiedId: { type: [Number, String, null], default: null }
})

defineEmits(['close', 'copy-link', 'preview-image'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
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
</script>
