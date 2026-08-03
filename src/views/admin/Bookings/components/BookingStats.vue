<template>
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
      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <span class="material-symbols-outlined text-[160px]">mountain_flag</span>
      </div>
    </div>
    <div class="bg-surface-container-lowest border border-outline-variant/10 p-4 md:p-5 rounded-2xl flex flex-col justify-between shadow-sm">
      <p class="font-label uppercase tracking-widest text-[9px] text-on-surface-variant font-black">Reservasi Aktif</p>
      <h3 class="text-2xl md:text-2xl font-black font-headline text-on-surface mt-1">{{ confirmedCount }}</h3>
      <div class="h-1 w-full bg-surface-container rounded-full mt-4">
        <div class="h-1 bg-emerald-600 rounded-full" :style="{ width: ((confirmedCount / (totalCount || 1)) * 100) + '%' }"></div>
      </div>
    </div>
    <div class="bg-tertiary-container text-white p-4 md:p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-tertiary/10">
      <p class="font-label uppercase tracking-widest text-[9px] text-on-tertiary-container font-black">Menunggu Konfirmasi</p>
      <h3 class="text-2xl md:text-2xl font-black font-headline mt-1">{{ pendingCount }}</h3>
      <button @click="$emit('filter-pending')" class="mt-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-white/80 transition-colors">
        Lihat Detail <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalRevenue: { type: Number, default: 0 },
  confirmedCount: { type: Number, default: 0 },
  pendingCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 }
})

defineEmits(['filter-pending'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}
</script>
