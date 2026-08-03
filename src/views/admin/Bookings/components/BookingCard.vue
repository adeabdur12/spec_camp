<template>
  <div class="group bg-surface-container-lowest p-4 md:p-5 rounded-3xl border border-outline-variant/10 transition-all duration-300 hover:shadow-lg hover:border-primary/20 mb-4">
    <div class="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-6">
      <!-- Tamu & Kegiatan -->
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

      <!-- Jadwal -->
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
          <span v-for="i in booking.InventoryItems" :key="'inv-'+i.id" class="text-[7px] font-bold text-blue-600">
            {{ i.BookingInventory?.quantity }}{{ i.name.slice(0,3) }}
          </span>
          <span v-for="s in booking.ExtraServices" :key="'extra-'+s.id" 
                :class="s.type === 'mimount' ? 'text-blue-600' : s.type === 'eksternal' ? 'text-purple-600' : 'text-emerald-600'" 
                class="text-[7px] font-bold">
            +{{ s.name.slice(0,4) }}
          </span>
        </div>
      </div>

      <!-- Total Biaya -->
      <div class="col-span-2 w-full md:text-center mt-1 md:mt-0">
        <p class="text-base md:text-base font-black text-primary">{{ formatCurrency(booking.totalPrice) }}</p>
      </div>

      <!-- Status & Aksi -->
      <div class="col-span-3 flex items-center justify-between w-full mt-2 pt-4 border-t border-outline-variant/5 md:border-none md:mt-0 md:pt-0">
        <!-- Status -->
        <div class="flex-1 md:flex-none md:col-span-2 flex md:justify-center gap-1.5">
          <span :class="getStatusBadgeClass(booking.status)" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black rounded-full uppercase tracking-tighter shadow-sm border border-black/5 whitespace-nowrap">
            <span :class="getStatusDotClass(booking.status)" class="w-1.5 h-1.5 rounded-full"></span>
            {{ translateStatus(booking.status) }}
          </span>
          <span v-if="isSettled" class="inline-flex items-center gap-1 px-2 py-1.5 text-[9px] font-black rounded-full uppercase tracking-tighter bg-emerald-600 text-white whitespace-nowrap">
            <span class="material-symbols-outlined text-xs">payments</span>
            Settled
          </span>
        </div>

        <!-- Aksi -->
        <div class="flex items-center gap-1">
          <!-- Status Toggle -->
          <div class="relative">
            <button @click.stop="$emit('toggle-status', booking.id)"
                    class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-primary transition-all" 
                    title="Ganti Status">
              <span class="material-symbols-outlined text-lg">published_with_changes</span>
            </button>
            <div v-if="statusOpenId === booking.id" @click.stop
                 class="absolute right-0 bottom-full mb-2 bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl p-2 z-[70] min-w-[150px]">
              <p class="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest px-3 py-1 mb-1 border-b border-outline-variant/5">Ganti Status</p>
              <button v-for="st in ['pending', 'confirmed', 'completed', 'cancelled']" :key="st"
                      @click="$emit('update-status', booking, st)"
                      class="w-full text-left px-3 py-2 text-[10px] font-bold rounded-xl hover:bg-surface-container transition-all flex items-center justify-between"
                      :class="booking.status === st ? 'text-primary bg-primary/5' : 'text-on-surface-variant'">
                {{ translateStatus(st) }}
                <span v-if="booking.status === st" class="material-symbols-outlined text-sm">check_circle</span>
              </button>
            </div>
          </div>

          <!-- Lihat Detail -->
          <button @click="$emit('view-detail', booking)" 
                  class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-primary transition-all" 
                  title="Detail">
            <span class="material-symbols-outlined text-lg">visibility</span>
          </button>

          <!-- Popover Edit & Hapus -->
          <div class="relative">
            <button @click.stop="$emit('toggle-actions', booking.id)"
                    class="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-primary transition-all">
              <span class="material-symbols-outlined text-lg">more_vert</span>
            </button>
            <div v-if="actionsOpenId === booking.id" @click.stop
                 class="absolute right-0 bottom-full mb-2 bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl p-1.5 z-[70] min-w-[150px]">
              <button @click="$emit('edit', booking); $emit('toggle-actions', booking.id)"
                      class="w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl hover:bg-surface-container transition-all flex items-center gap-2.5 text-on-surface">
                <span class="material-symbols-outlined text-lg text-primary">edit</span>
                Ubah
              </button>
              <div class="border-t border-outline-variant/10 my-1"></div>
              <button @click="$emit('delete', booking.id); $emit('toggle-actions', booking.id)"
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
</template>

<script setup>
const props = defineProps({
  booking: { type: Object, required: true },
  isSettled: { type: Boolean, default: false },
  statusOpenId: { type: [Number, String, null], default: null },
  actionsOpenId: { type: [Number, String, null], default: null },
  copiedId: { type: [Number, String, null], default: null }
})

defineEmits([
  'toggle-status',
  'update-status',
  'view-detail',
  'copy-link',
  'toggle-actions',
  'edit',
  'delete'
])

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
</script>
