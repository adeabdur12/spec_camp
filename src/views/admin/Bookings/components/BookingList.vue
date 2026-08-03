<template>
  <div class="bg-surface-container-low md:rounded-3xl overflow-hidden">
    <slot name="filters" />

    <div class="p-2 md:p-6 space-y-3 md:space-y-4">
      <!-- Loading overlay for pagination -->
      <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

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
      <div v-if="!loading && bookings.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3 block">inbox</span>
        <p class="text-on-surface-variant text-sm">Tidak ada reservasi yang ditemukan</p>
      </div>
      
      <BookingCard 
        v-else
        v-for="booking in bookings" 
        :key="booking.id"
        :booking="booking"
        :is-settled="isBookingSettled(booking)"
        :status-open-id="statusOpenId"
        :actions-open-id="actionsOpenId"
        :copied-id="copiedId"
        @toggle-status="$emit('toggle-status', $event)"
        @update-status="(b, s) => $emit('update-status', b, s)"
        @view-detail="$emit('view-detail', $event)"
        @copy-link="$emit('copy-link', $event)"
        @toggle-actions="$emit('toggle-actions', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="bg-surface-container-lowest p-4 border-t border-outline-variant/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-xs text-on-surface-variant">
        Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, totalItems) }} dari {{ totalItems }} reservasi
      </div>
      <div class="flex items-center gap-2">
        <button @click="$emit('prev-page')" :disabled="currentPage === 1"
                class="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-surface-container text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <button v-for="page in visiblePages" :key="page" @click="$emit('go-to-page', page)"
                :class="page === currentPage ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
                class="w-9 h-9 rounded-lg text-xs font-bold transition-all">
          {{ page }}
        </button>
        <button @click="$emit('next-page')" :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-surface-container text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BookingCard from './BookingCard.vue'

const props = defineProps({
  bookings: { type: Array, default: () => [] },
  filter: { type: String, default: 'all' },
  currentPage: { type: Number, default: 1 },
  itemsPerPage: { type: Number, default: 10 },
  totalItems: { type: Number, default: 0 },
  totalPages: { type: Number, default: 0 },
  statusOpenId: { type: [Number, String, null], default: null },
  actionsOpenId: { type: [Number, String, null], default: null },
  copiedId: { type: [Number, String, null], default: null },
  settlements: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits([
  'update:filter',
  'toggle-status',
  'update-status',
  'view-detail',
  'copy-link',
  'toggle-actions',
  'edit',
  'delete',
  'prev-page',
  'next-page',
  'go-to-page'
])

const isBookingSettled = (booking) => {
  if (!booking.checkInDate || booking.status !== 'completed') return false
  const d = new Date(booking.checkInDate)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return props.settlements.some(s => s.year === year && s.month === month && s.paidAt)
}

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
