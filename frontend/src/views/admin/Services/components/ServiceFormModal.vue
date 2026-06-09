<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Layanan' : 'Layanan Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Atur harga & detail layanan</p>
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
            <label class="text-xs font-medium text-on-surface-variant">Nama Layanan *</label>
            <input v-model="form.name" type="text" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                   placeholder="cth: Pemandu Wisata">
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Tipe Biaya *</label>
            <select v-model="form.type" required
                    class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
              <option value="spec_camp">Spec Camp</option>
              <option value="mimount">Mimount</option>
              <option value="eksternal">Eksternal</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Kategori</label>
              <select v-model="form.category" required
                      class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
                <option value="guide">Pemandu</option>
                <option value="games">Permainan</option>
                <option value="ticket">Tiket</option>
                <option value="transport">Transportasi</option>
                <option value="documentation">Dokumentasi</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Satuan</label>
              <input v-model="form.unit" type="text" required
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                     placeholder="cth: orang, jam">
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Tarif (IDR) *</label>
            <input v-model.number="form.price" type="number" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                   placeholder="0">
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Deskripsi</label>
            <textarea v-model="form.description" rows="2"
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                   placeholder="Detail layanan..."></textarea>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Ikon</label>
            <select v-model="form.icon"
                    class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
              <option value="">Tidak ada ikon</option>
              <option v-for="ico in iconList" :key="ico.value" :value="ico.value">
                {{ ico.label }}
              </option>
            </select>
            <div v-if="form.icon" class="flex items-center gap-2 mt-1">
              <span class="material-symbols-outlined text-lg text-primary">{{ form.icon }}</span>
              <span class="text-xs text-on-surface-variant">{{ form.icon }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
            <label for="isActive" class="text-sm font-medium text-on-surface">Layanan aktif dan tersedia</label>
          </div>

          <div class="flex items-center gap-3">
            <input v-model="form.isViewPublic" type="checkbox" id="isViewPublic" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
            <label for="isViewPublic" class="text-sm font-medium text-on-surface">Tampilkan di halaman booking publik</label>
          </div>

          <div class="pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Layanan' }}
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

const iconList = [
  { value: 'hiking', label: '🥾 Hiking' },
  { value: 'groups', label: '👥 Groups' },
  { value: 'nature', label: '🌿 Nature' },
  { value: 'camping', label: '🏕️ Camping' },
  { value: 'fire_pit', label: '🔥 Fire Pit' },
  { value: 'celebration', label: '🎉 Celebration' },
  { value: 'directions_run', label: '🏃 Run' },
  { value: 'theater_comedy', label: '🎭 Comedy' },
  { value: 'photo_camera', label: '📷 Camera' },
  { value: 'videocam', label: '🎥 Video' },
  { value: 'music_note', label: '🎵 Music' },
  { value: 'local_taxi', label: '🚕 Taxi' },
  { value: 'local_hospital', label: '🏥 Medical' },
  { value: 'restaurant', label: '🍽️ Restaurant' },
  { value: 'checkroom', label: '🧳 Checkroom' },
  { value: 'flashlight_on', label: '🔦 Flashlight' },
  { value: 'kayaking', label: '🛶 Kayaking' },
  { value: 'celebration', label: '🎊 Party' },
  { value: 'movie', label: '🎬 Movie' },
  { value: 'gamepad', label: '🎮 Games' }
]
</script>
