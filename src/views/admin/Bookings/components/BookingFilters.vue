<template>
  <div class="bg-surface-container-lowest p-3 md:p-5 border-b border-outline-variant/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 class="text-base font-extrabold font-headline tracking-tight text-on-surface">Daftar Reservasi</h2>
    <div class="flex flex-wrap gap-2">
      <button 
        v-for="f in filters" 
        :key="f.value"
        @click="$emit('update:modelValue', f.value)"
        :class="modelValue === f.value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
        class="px-4 py-2 rounded-lg text-sm font-bold font-label transition-all active:scale-95">
        {{ f.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'all' }
})

defineEmits(['update:modelValue'])

const filters = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Tertunda' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'completed', label: 'Selesai' }
]
</script>
