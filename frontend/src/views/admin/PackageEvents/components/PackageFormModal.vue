<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Paket' : 'Paket Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Atur harga, kapasitas, dan bagi hasil</p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="$emit('save')" class="space-y-6">
          <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="space-y-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Detail Dasar</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Nama Paket *</label>
                <input v-model="form.name" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="cth: Paket Gathering Premium">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Isi / Orang</label>
                <input v-model="form.perPerson" type="text"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="Misal: Tiket masuk, toilet, parkir">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Kategori *</label>
                <select v-model="form.category" required
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="area">Area & Camping</option>
                  <option value="community">Event / Gathering</option>
                  <option value="ticket">Ticket Masuk</option>
                  <option value="tracking">Tracking</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant">Deskripsi</label>
              <textarea v-model="form.description" rows="2"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                     placeholder="Apa saja yang termasuk dalam paket ini?"></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-medium text-on-surface-variant">Include / Fasilitas</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="(item, idx) in form.features" :key="idx"
                      class="inline-flex items-center gap-1 text-[11px] bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">
                  {{ item }}
                  <button type="button" @click="removeFeature(idx)" class="hover:text-error transition-colors">
                    <span class="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input v-model="newFeature" type="text"
                       class="flex-1 bg-surface-container px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="cth: Tenda, Tiket Masuk, Makan" @keydown.enter.prevent="addFeature">
                <button type="button" @click="addFeature"
                        class="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors shrink-0">
                  Tambah
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-outline-variant/10 pt-4 space-y-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider">Bagi Hasil</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Harga Per Pax (IDR) *</label>
                <input v-model.number="form.pricePerPax" type="number" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="0">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Share Mimount (per pax) *</label>
                <input v-model.number="form.mimountShare" type="number" required min="0"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="0">
              </div>
            </div>
            <div v-if="revenuePreview.specCampShare > 0" class="bg-surface-container rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-on-surface-variant">Harga Per Pax</span>
                <span class="font-medium text-on-surface">{{ formatCurrency(revenuePreview.basePrice) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-on-surface-variant">Share Mimount</span>
                <span class="font-medium text-blue-600">- {{ formatCurrency(revenuePreview.mimountShare) }}</span>
              </div>
              <div class="border-t border-outline-variant/5 pt-2 flex justify-between text-sm">
                <span class="text-on-surface-variant">Pajak 10%</span>
                <span class="font-medium text-red-500">- {{ formatCurrency(revenuePreview.tax) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-on-surface-variant">Warga 5%</span>
                <span class="font-medium text-orange-500">- {{ formatCurrency(revenuePreview.localFee) }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold">
                <span class="text-on-surface">Net Share Spec Camp</span>
                <span class="text-emerald-600">{{ formatCurrency(revenuePreview.specCampNet) }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-outline-variant/10 pt-4 space-y-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Aturan & Kapasitas</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Min. Pax</label>
                <input v-model.number="form.minPax" type="number"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="1">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Maks. Pax</label>
                <input v-model.number="form.maxPax" type="number"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                       placeholder="100">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Tipe Hari</label>
                <select v-model="form.dayType"
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="">Semua Hari</option>
                  <option value="weekday">Hari Kerja</option>
                  <option value="weekend">Akhir Pekan</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant">Tingkat</label>
                <select v-model="form.packageType"
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="">Standar</option>
                  <option value="ekonomi">Ekonomi</option>
                  <option value="full">Full Service</option>
                </select>
              </div>
            </div>
          </div>

          <div class="border-t border-outline-variant/10 pt-4 flex flex-col md:flex-row gap-6">
            <div class="flex items-center gap-2">
              <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
              <label for="isActive" class="text-sm font-medium text-on-surface">Publikasikan (Aktif)</label>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="form.isFeatured" type="checkbox" id="isFeatured" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
              <label for="isFeatured" class="text-sm font-medium text-on-surface">Tampilkan di Halaman Depan</label>
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">Batal</button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Paket & Aturan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  form: Object,
  editingId: [Number, String],
  saving: Boolean,
  errorMessage: String,
  revenuePreview: Object
})

defineEmits(['close', 'save'])

const newFeature = ref('')

const addFeature = () => {
  const val = newFeature.value.trim()
  if (!val) return
  if (!Array.isArray(props.form.features)) props.form.features = []
  if (!props.form.features.includes(val)) {
    props.form.features.push(val)
  }
  newFeature.value = ''
}

const removeFeature = (idx) => {
  if (!Array.isArray(props.form.features)) props.form.features = []
  props.form.features.splice(idx, 1)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0)
}
</script>
