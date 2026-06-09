<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Ubah Alat' : 'Alat Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Detail alat & informasi stok</p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="$emit('save')" class="space-y-5">
          <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{{ errorMessage }}</span>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-primary uppercase tracking-wider">Gambar Alat</label>
            <div class="flex items-center gap-4">
              <div class="w-24 h-24 rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center overflow-hidden bg-surface-container">
                <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-full object-cover">
                <span v-else class="material-symbols-outlined text-on-surface-variant">image</span>
              </div>
              <div class="flex-1 space-y-2">
                <input type="file" @change="handleImageUpload" accept="image/*" class="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer">
                <p class="text-[10px] text-on-surface-variant">Maks 2MB. Gambar akan ditampilkan di pemilihan paket.</p>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5 md:col-span-2">
                <label class="text-xs font-medium text-on-surface-variant">Nama Alat *</label>
                <input v-model="form.name" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="cth: Tenda Dome Kapasitas 4">
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Kategori *</label>
                <input v-model="form.categoryId" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="cth: Tenda, Matras, Lampu">
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Harga Sewa (IDR) *</label>
                <input v-model.number="form.price" type="number" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="0">
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Deskripsi</label>
              <textarea v-model="form.description" rows="2"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                     placeholder="Spesifikasi dan kondisi alat..."></textarea>
            </div>
          </div>

          <div class="border-t border-outline-variant/10 pt-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Jumlah Stok *</label>
                <input v-model.number="form.stock" type="number" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="0">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Satuan</label>
                <input v-model="form.unit" type="text"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="cth: unit, pcs, set">
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input v-model="form.isAvailable" type="checkbox" id="isAvailable" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
              <label for="isAvailable" class="text-sm font-medium text-on-surface">Alat tersedia untuk disewa</label>
            </div>
          </div>

          <div class="pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Alat' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '../../../../services/api'

const props = defineProps({
  form: Object,
  editingId: [Number, String],
  saving: Boolean,
  errorMessage: String
})

defineEmits(['close', 'save'])

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await api.post('/upload/package-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.success) {
      props.form.imageUrl = res.data.url
    }
  } catch (err) {
    console.error('Gagal mengunggah:', err)
  }
}
</script>
