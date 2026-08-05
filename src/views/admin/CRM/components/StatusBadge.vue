<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
        :class="badgeClass">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const label = computed(() => {
  const map = {
    belum_dihubungi: 'Baru',
    sudah_dihubungi: 'Dihubungi',
    tertarik: 'Tertarik',
    negosiasi: 'Negosiasi',
    deal: 'Deal',
    tidak_tertarik: 'Tidak'
  }
  return map[props.status] || props.status
})

const badgeClass = computed(() => {
  const map = {
    belum_dihubungi: 'bg-surface-container-high text-on-surface-variant',
    sudah_dihubungi: 'bg-blue-100 text-blue-700',
    tertarik: 'bg-green-100 text-green-700',
    negosiasi: 'bg-yellow-100 text-yellow-700',
    deal: 'bg-primary/15 text-primary',
    tidak_tertarik: 'bg-error/10 text-error'
  }
  return map[props.status] || 'bg-surface-container-high text-on-surface-variant'
})
</script>
