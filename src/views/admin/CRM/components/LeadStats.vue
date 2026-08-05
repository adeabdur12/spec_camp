<template>
  <div v-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
    <div class="bg-surface-container-lowest rounded-xl p-3 sm:p-4">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary text-base sm:text-lg">people</span>
        </div>
        <div class="min-w-0">
          <p class="text-xl sm:text-2xl font-black text-on-surface">{{ stats.total || 0 }}</p>
          <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total</p>
        </div>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-xl p-3 sm:p-4">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-green-700 text-base sm:text-lg">handshake</span>
        </div>
        <div class="min-w-0">
          <p class="text-xl sm:text-2xl font-black text-on-surface">{{ stats.byStatus?.deal || 0 }}</p>
          <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Deal</p>
        </div>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-xl p-3 sm:p-4">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-yellow-700 text-base sm:text-lg">trending_up</span>
        </div>
        <div class="min-w-0">
          <p class="text-xl sm:text-2xl font-black text-on-surface">{{ (stats.byStatus?.tertarik || 0) + (stats.byStatus?.negosiasi || 0) }}</p>
          <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Prospek</p>
        </div>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-xl p-3 sm:p-4">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-secondary text-base sm:text-lg">school</span>
        </div>
        <div class="min-w-0">
          <p class="text-xl sm:text-2xl font-black text-on-surface">{{ stats.byCategory?.sekolah || 0 }}</p>
          <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Sekolah</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Object, default: null }
})
</script>
