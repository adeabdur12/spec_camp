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

          <!-- Type Selector -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant">Tipe Layanan *</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" @click="form.type = 'spec_camp'"
                      :class="['px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2',
                               form.type === 'spec_camp' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-transparent bg-surface-container text-on-surface-variant hover:border-primary/30']">
                Spec Camp
              </button>
              <button type="button" @click="form.type = 'mimount'"
                      :class="['px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2',
                               form.type === 'mimount' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent bg-surface-container text-on-surface-variant hover:border-primary/30']">
                Mimount
              </button>
              <button type="button" @click="form.type = 'eksternal'"
                      :class="['px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2',
                               form.type === 'eksternal' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-transparent bg-surface-container text-on-surface-variant hover:border-primary/30']">
                Eksternal
              </button>
            </div>
            <p class="text-[10px] text-on-surface-variant/60 mt-1">
              <span v-if="form.type === 'spec_camp'">Pendapatan 100% untuk Spec Camp</span>
              <span v-else-if="form.type === 'mimount'">Pendapatan 100% untuk Mimount Outdoor</span>
              <span v-else>Dipotong sebelum bagi hasil (tidak masuk ke siapapun)</span>
            </p>
          </div>

          <!-- Icon Picker -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-on-surface-variant">Ikon</label>
            <div class="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-48 overflow-y-auto p-3 bg-surface-container rounded-xl border border-outline-variant/10">
              <button v-for="ico in iconList" :key="ico.value" type="button"
                      @click="form.icon = form.icon === ico.value ? '' : ico.value"
                      :class="['w-full aspect-square rounded-lg flex items-center justify-center text-lg sm:text-base border-2 transition-all',
                               form.icon === ico.value ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container-high text-on-surface-variant hover:border-primary/30 hover:text-primary']"
                      :title="ico.label">
                <i :class="'bi ' + ico.value"></i>
              </button>
            </div>
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
  { value: 'bi-tree', label: 'Tree' },
  { value: 'bi-flower1', label: 'Flower' },
  { value: 'bi-signpost-2', label: 'Signpost' },
  { value: 'bi-water', label: 'Water' },
  { value: 'bi-sun', label: 'Sun' },
  { value: 'bi-moon-stars', label: 'Moon' },
  { value: 'bi-star', label: 'Star' },
  { value: 'bi-fire', label: 'Fire' },
  { value: 'bi-cloud-sun', label: 'Cloud Sun' },
  { value: 'bi-rainbow', label: 'Rainbow' },
  { value: 'bi-snow', label: 'Snow' },
  { value: 'bi-wind', label: 'Wind' },
  { value: 'bi-tsunami', label: 'Wave' },
  { value: 'bi-droplet', label: 'Droplet' },
  { value: 'bi-backpack', label: 'Backpack' },
  { value: 'bi-compass', label: 'Compass' },
  { value: 'bi-map', label: 'Map' },
  { value: 'bi-binoculars', label: 'Binoculars' },
  { value: 'bi-lamp', label: 'Lamp' },
  { value: 'bi-lightbulb', label: 'Lightbulb' },
  { value: 'bi-lightning', label: 'Lightning' },
  { value: 'bi-plug', label: 'Plug' },
  { value: 'bi-person-walking', label: 'Hiking' },
  { value: 'bi-bicycle', label: 'Bicycle' },
  { value: 'bi-signpost', label: 'Trail' },
  { value: 'bi-people', label: 'Group' },
  { value: 'bi-person', label: 'Person' },
  { value: 'bi-person-arms-up', label: 'Celebrate' },
  { value: 'bi-emoji-smile', label: 'Happy' },
  { value: 'bi-emoji-laughing', label: 'Fun' },
  { value: 'bi-hand-thumbs-up', label: 'Like' },
  { value: 'bi-heart', label: 'Heart' },
  { value: 'bi-heart-pulse', label: 'Health' },
  { value: 'bi-cup-hot', label: 'Drink' },
  { value: 'bi-cup-straw', label: 'Straw' },
  { value: 'bi-basket', label: 'Basket' },
  { value: 'bi-basket2', label: 'Basket 2' },
  { value: 'bi-bag', label: 'Bag' },
  { value: 'bi-bag-check', label: 'Bag Check' },
  { value: 'bi-tools', label: 'Tools' },
  { value: 'bi-wrench', label: 'Wrench' },
  { value: 'bi-gear', label: 'Gear' },
  { value: 'bi-box', label: 'Box' },
  { value: 'bi-box-seam', label: 'Package' },
  { value: 'bi-car-front', label: 'Car' },
  { value: 'bi-scooter', label: 'Scooter' },
  { value: 'bi-bus-front', label: 'Bus' },
  { value: 'bi-truck', label: 'Truck' },
  { value: 'bi-fuel-pump', label: 'Fuel' },
  { value: 'bi-camera', label: 'Camera' },
  { value: 'bi-camera-video', label: 'Video' },
  { value: 'bi-film', label: 'Film' },
  { value: 'bi-music-note-beamed', label: 'Music' },
  { value: 'bi-music-note', label: 'Note' },
  { value: 'bi-headphones', label: 'Headphone' },
  { value: 'bi-speaker', label: 'Speaker' },
  { value: 'bi-mic', label: 'Mic' },
  { value: 'bi-controller', label: 'Gamepad' },
  { value: 'bi-dice-1', label: 'Dice' },
  { value: 'bi-puzzle', label: 'Puzzle' },
  { value: 'bi-trophy', label: 'Trophy' },
  { value: 'bi-award', label: 'Award' },
  { value: 'bi-star-fill', label: 'Star Fill' },
  { value: 'bi-flag', label: 'Flag' },
  { value: 'bi-shield-check', label: 'Shield' },
  { value: 'bi-shield', label: 'Shield Outline' },
  { value: 'bi-bandaid', label: 'First Aid' },
  { value: 'bi-hospital', label: 'Hospital' },
  { value: 'bi-info-circle', label: 'Info' },
  { value: 'bi-question-circle', label: 'Help' },
  { value: 'bi-telephone', label: 'Phone' },
  { value: 'bi-chat-dots', label: 'Chat' },
  { value: 'bi-envelope', label: 'Mail' },
  { value: 'bi-clock', label: 'Clock' },
  { value: 'bi-calendar', label: 'Calendar' },
  { value: 'bi-calendar-check', label: 'Calendar Check' },
  { value: 'bi-house', label: 'Home' },
  { value: 'bi-building', label: 'Building' },
  { value: 'bi-door-open', label: 'Door' },
  { value: 'bi-brightness-high', label: 'Bright' },
  { value: 'bi-moon', label: 'Moon' },
  { value: 'bi-currency-dollar', label: 'Price' },
  { value: 'bi-cash', label: 'Cash' },
  { value: 'bi-credit-card', label: 'Card' },
  { value: 'bi-wallet', label: 'Wallet' },
  { value: 'bi-graph-up', label: 'Growth' },
  { value: 'bi-pie-chart', label: 'Chart' },
  { value: 'bi-clipboard-data', label: 'Report' },
  { value: 'bi-search', label: 'Search' },
  { value: 'bi-pin-map', label: 'Location' },
  { value: 'bi-geo-alt', label: 'Map Pin' },
  { value: 'bi-globe', label: 'Global' }
]
</script>
