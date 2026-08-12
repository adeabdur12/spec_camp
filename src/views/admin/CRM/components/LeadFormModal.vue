<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-[90] flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
         @click.stop>
      <!-- Header -->
      <div class="p-4 border-b border-outline-variant/10 flex items-center justify-between sticky top-0 bg-surface-container-lowest z-10 rounded-t-2xl">
        <h3 class="font-bold text-on-surface">{{ editing ? 'Edit Lead' : 'Tambah Lead Baru' }}</h3>
        <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-surface-container transition-all">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <!-- Form -->
      <div class="p-4 space-y-3">
        <!-- Category & Name -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Kategori *</label>
            <select v-model="form.category"
                    class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30">
              <option value="sekolah">Sekolah</option>
              <option value="perusahaan">Perusahaan</option>
              <option value="komunitas">Komunitas</option>
              <option value="instansi">Instansi</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Nama Instansi *</label>
            <input v-model="form.name" type="text" placeholder="SMAN 1 Cicurug"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Type & District -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Jenis</label>
            <input v-model="form.type" type="text" placeholder="SMA, Pabrik, Kantor"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Kecamatan</label>
            <input v-model="form.district" type="text" placeholder="Cicurug"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Alamat</label>
          <input v-model="form.address" type="text" placeholder="Jl. Raya No.1"
                 class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Telepon</label>
            <input v-model="form.phone" type="text" placeholder="08123456789"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">WhatsApp</label>
            <input v-model="form.whatsapp" type="text" placeholder="08123456789"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Email & PIC -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">PIC / Contact Person</label>
            <input v-model="form.contactPerson" type="text" placeholder="Nama PIC"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Role & Maps -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Jabatan PIC</label>
            <input v-model="form.contactRole" type="text" placeholder="Kesiswaan"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Google Maps URL</label>
            <input v-model="form.googleMapsUrl" type="url" placeholder="https://maps.google.com/..."
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Social Media -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Facebook URL</label>
            <input v-model="form.facebookUrl" type="url" placeholder="https://facebook.com/..."
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Instagram URL</label>
            <input v-model="form.instagramUrl" type="url" placeholder="https://instagram.com/..."
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Status & Priority -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Status</label>
            <select v-model="form.status"
                    class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30">
              <option value="belum_dihubungi">Belum Dihubungi</option>
              <option value="sudah_dihubungi">Sudah Dihubungi</option>
              <option value="tertarik">Tertarik</option>
              <option value="negosiasi">Negosiasi</option>
              <option value="deal">Deal</option>
              <option value="tidak_tertarik">Tidak Tertarik</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Prioritas</label>
            <select v-model="form.priority"
                    class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30">
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
          </div>
        </div>

        <!-- Pax & Package -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Estimasi Pax</label>
            <input v-model="form.estimatedPax" type="number" placeholder="50"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Paket Diminati</label>
            <input v-model="form.interestedPackage" type="text" placeholder="Paket Camping"
                   class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <!-- Follow-up Date -->
        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Jadwal Follow-up</label>
          <input v-model="form.nextFollowUpDate" type="date"
                 class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30" />
        </div>

        <!-- Notes -->
        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Catatan</label>
          <textarea v-model="form.notes" rows="3" placeholder="Catatan umum..."
                    class="w-full px-3 py-2.5 bg-surface-container-low rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30 resize-none"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-outline-variant/10 flex flex-col gap-2 sticky bottom-0 bg-surface-container-lowest rounded-b-2xl">
        <div v-if="error" class="flex items-center gap-2 px-3 py-2 bg-error/10 text-error rounded-lg text-xs font-semibold">
          <span class="material-symbols-outlined text-base">error</span>
          {{ error }}
        </div>
        <div class="flex justify-end gap-2">
        <button @click="$emit('close')"
                class="px-4 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container-highest transition-all">
          Batal
        </button>
        <button @click="$emit('save')" :disabled="!form.name || saving"
                class="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all">
          {{ saving ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Buat Lead') }}
        </button>
      </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  form: { type: Object, required: true },
  editing: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

defineEmits(['close', 'save'])
</script>
