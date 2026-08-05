<template>
  <div class="flex items-center gap-2 text-xs text-on-surface-variant">
    <span class="material-symbols-outlined text-sm flex-shrink-0">{{ icon }}</span>
    <span class="truncate">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  text: { type: String, default: '' }
})
</script>
