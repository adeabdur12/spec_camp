<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="cancel"></div>
      <div class="relative bg-surface-container-lowest w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-outline-variant/10 text-center p-8 transform transition-all animate-in fade-in zoom-in duration-200">
      
      <div class="w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <span class="material-symbols-outlined text-[40px]">delete_forever</span>
      </div>
      
      <h3 class="text-2xl font-black text-on-surface font-headline tracking-tight mb-2 uppercase">{{ title }}</h3>
      <p class="text-sm font-medium text-on-surface-variant mb-8">{{ message }}</p>
      
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="cancel" class="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors uppercase tracking-widest">
          Batal
        </button>
        <button @click="confirm" class="flex-1 px-6 py-3.5 rounded-xl text-sm font-black text-white bg-error hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-error/20 uppercase tracking-widest">
          Hapus
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.' }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>
