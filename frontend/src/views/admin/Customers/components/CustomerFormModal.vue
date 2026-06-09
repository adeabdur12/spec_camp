<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Data Pelanggan' : 'Pelanggan Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Lengkapi informasi dasar dan kontak darurat tamu.</p>
          </div>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="$emit('save')" class="space-y-5">
          <!-- Basic Info -->
          <div>
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3 font-label">Informasi Dasar</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Nama Lengkap *</label>
                <input v-model="form.name" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="Sesuai kartu identitas">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">No. Telepon / WA *</label>
                <input v-model="form.phone" type="text" required
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="0812...">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Tanggal Lahir</label>
                <input v-model="form.dateOfBirth" type="date"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
              </div>
            </div>
          </div>

          <!-- Identity Details -->
          <div class="border-t border-outline-variant/10 pt-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3 font-label">Detail Identitas</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Jenis ID</label>
                <select v-model="form.idCardType"
                        class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body uppercase">
                  <option value="ktp">KTP</option>
                  <option value="sim">SIM</option>
                  <option value="passport">PASPOR</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Nomor ID</label>
                <input v-model="form.idCard" type="text"
                       class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="Nomor identitas...">
              </div>
            </div>
            <div class="space-y-1.5 mt-4">
              <label class="text-xs font-medium text-on-surface-variant font-label">Alamat Lengkap</label>
              <textarea v-model="form.address" rows="2"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body resize-none"
                     placeholder="Tuliskan alamat sesuai KTP..."></textarea>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="border-t border-outline-variant/10 pt-4 bg-error-container/20 -mx-6 md:-mx-8 px-6 md:px-8 py-4">
            <h4 class="text-xs font-bold text-tertiary-container uppercase tracking-wider mb-3 font-label">Kontak Darurat</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">Nama Kontak Darurat</label>
                <input v-model="form.emergencyContact" type="text"
                       class="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="Nama Wali/Kerabat">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-on-surface-variant font-label">No. Telepon Darurat</label>
                <input v-model="form.emergencyPhone" type="text"
                       class="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 text-sm font-body"
                       placeholder="0813...">
              </div>
            </div>
          </div>

          <!-- Extra Notes -->
          <div class="space-y-1.5 pt-2">
            <label class="text-xs font-medium text-on-surface-variant font-label">Catatan Tambahan</label>
            <textarea v-model="form.notes" rows="2"
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body resize-none"
                   placeholder="Catat kondisi medis, pantangan makanan, atau permintaan khusus..."></textarea>
          </div>

          <div class="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Data Pelanggan' }}
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
</script>
