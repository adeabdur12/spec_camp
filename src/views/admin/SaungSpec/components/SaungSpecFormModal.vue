<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Menu' : 'Menu Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Tambahkan atau ubah item menu Saung SPEC</p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="$emit('save')" class="space-y-4">
          <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Nama Menu *</label>
            <input v-model="form.name" type="text" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                   placeholder="cth: Nasi Goreng Komplet">
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Kategori *</label>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="cat in categoryOptions" :key="cat.value" type="button"
                      @click="form.category = cat.value"
                      :class="['px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2',
                               form.category === cat.value ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container text-on-surface-variant hover:border-primary/30']">
                {{ cat.label }}
              </button>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Harga (IDR) *</label>
            <input v-model.number="form.price" type="number" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                   placeholder="0">
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Deskripsi</label>
            <textarea v-model="form.description" rows="2"
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                   placeholder="Detail menu..."></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Urutan</label>
              <input v-model.number="form.sortOrder" type="number"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                     placeholder="0">
            </div>
            <div class="flex items-end pb-1">
              <div class="flex items-center gap-3">
                <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
                <label for="isActive" class="text-sm font-medium text-on-surface">Aktif</label>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Menu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  form: Object,
  editingId: [Number, String],
  saving: Boolean,
  errorMessage: String
})

defineEmits(['close', 'save'])

const categoryOptions = [
  { value: 'makanan', label: 'Makanan' },
  { value: 'cemilan', label: 'Cemilan' },
  { value: 'rebusan', label: 'Rebusan' },
  { value: 'minuman', label: 'Minuman' }
]
</script>
