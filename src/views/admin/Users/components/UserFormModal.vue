<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-outline-variant/10">
      <div class="p-6 md:p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-base font-bold text-primary font-headline">
              {{ editingId ? 'Perbarui Akun' : 'Akun Baru' }}
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Konfigurasi identitas login dan hak akses.</p>
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
            <label class="text-xs font-medium text-on-surface-variant font-label">Nama Pengguna *</label>
            <input v-model="form.name" type="text" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                   placeholder="cth: admin123">
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-on-surface-variant font-label">Alamat Email *</label>
            <input v-model="form.email" type="email" required
                   class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                   placeholder="admin@contoh.com">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant font-label">Peran Akses *</label>
              <select v-model="form.roleId" required
                      class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body">
                <option value="" disabled>Pilih Peran</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant font-label">Kata Sandi {{ editingId ? '(Opsional)' : '*' }}</label>
              <input v-model="form.password" type="password" :required="!editingId"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                     placeholder="••••••••">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-on-surface-variant font-label">Nomor WhatsApp</label>
              <input v-model="form.phone" type="text"
                     class="w-full bg-surface-container px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
                     placeholder="0812xxxxxx">
            </div>
            <div class="space-y-1.5 flex items-end pb-2.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.notifWa" type="checkbox" class="w-4 h-4 text-primary rounded focus:ring-primary/20">
                <span class="text-xs font-medium text-on-surface-variant font-label">Aktifkan Notifikasi WA</span>
              </label>
            </div>
          </div>

          <div class="pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving"
                    class="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/20">
              {{ saving ? 'Menyimpan...' : 'Simpan Akun' }}
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
  errorMessage: String,
  roles: Array
})

defineEmits(['close', 'save'])
</script>
