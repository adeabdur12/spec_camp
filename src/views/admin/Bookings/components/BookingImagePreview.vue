<template>
  <div v-if="imageUrl" class="fixed inset-0 z-[90] overflow-y-auto" @click="$emit('close')">
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="relative max-w-4xl w-full" @click.stop>
        <img :src="imageUrl" alt="Preview" class="w-full h-auto rounded-2xl">
        <button @click="$emit('close')"
                class="fixed top-4 right-4 w-9 h-9 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-lg hover:bg-surface-container transition-colors z-10">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageUrl: { type: String, default: null }
})

defineEmits(['close'])
</script>
