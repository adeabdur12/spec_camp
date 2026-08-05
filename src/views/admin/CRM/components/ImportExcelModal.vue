<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-[90] flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl" @click.stop>
      <!-- Header -->
      <div class="p-4 border-b border-outline-variant/10 flex items-center justify-between">
        <h3 class="font-bold text-on-surface">Import Leads dari Excel</h3>
        <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-surface-container transition-all">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        <!-- Download Template -->
        <div class="bg-primary/5 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-on-surface">Belum punya template?</p>
            <p class="text-[10px] text-on-surface-variant">Download format Excel terlebih dahulu</p>
          </div>
          <button @click="downloadTemplate" :disabled="downloading"
                  class="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-all whitespace-nowrap disabled:opacity-40">
            {{ downloading ? 'Downloading...' : 'Download' }}
          </button>
        </div>

        <!-- Upload Area -->
        <div v-if="!file" @click="triggerUpload"
             @dragover.prevent="isDragging = true"
             @dragleave="isDragging = false"
             @drop.prevent="handleDrop"
             class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
             :class="isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">upload_file</span>
          <p class="text-sm font-bold text-on-surface">Klik atau seret file Excel ke sini</p>
          <p class="text-[10px] text-on-surface-variant mt-1">Format: .xlsx (maks. 5MB)</p>
        </div>

        <!-- Selected File -->
        <div v-else class="bg-surface-container-low rounded-xl p-3 flex items-center gap-3">
          <span class="material-symbols-outlined text-lg text-green-600">description</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-on-surface truncate">{{ file.name }}</p>
            <p class="text-[10px] text-on-surface-variant">{{ formatSize(file.size) }}</p>
          </div>
          <button @click="file = null" class="p-1 rounded hover:bg-surface-container-high">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <!-- Progress -->
        <div v-if="importing" class="space-y-2">
          <div class="w-full bg-surface-container-high rounded-full h-1.5">
            <div class="bg-primary h-1.5 rounded-full animate-pulse" style="width: 100%"></div>
          </div>
          <p class="text-xs text-on-surface-variant text-center">Mengimpor data...</p>
        </div>

        <!-- Result -->
        <div v-if="result" class="bg-surface-container-low rounded-xl p-3 space-y-1">
          <p class="text-xs font-bold text-on-surface">Hasil Import</p>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <p class="text-lg font-black text-primary">{{ result.created }}</p>
              <p class="text-[10px] text-on-surface-variant">Berhasil</p>
            </div>
            <div>
              <p class="text-lg font-black text-secondary">{{ result.duplicates }}</p>
              <p class="text-[10px] text-on-surface-variant">Duplikat</p>
            </div>
            <div>
              <p class="text-lg font-black text-on-surface-variant">{{ result.totalRows }}</p>
              <p class="text-[10px] text-on-surface-variant">Total Baris</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-outline-variant/10 flex justify-end gap-2">
        <button @click="$emit('close')"
                class="px-4 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container-highest transition-all">
          {{ result ? 'Tutup' : 'Batal' }}
        </button>
        <button v-if="file && !result" @click="handleImport" :disabled="importing"
                class="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all">
          {{ importing ? 'Mengimpor...' : 'Import Sekarang' }}
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { leadService } from '../../../../services/leadService'

const emit = defineEmits(['close', 'imported'])

const file = ref(null)
const isDragging = ref(false)
const importing = ref(false)
const downloading = ref(false)
const result = ref(null)

const downloadTemplate = async () => {
  downloading.value = true
  try {
    await leadService.downloadTemplate()
  } catch (err) {
    console.error('Gagal download template:', err)
  } finally {
    downloading.value = false
  }
}

const triggerUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls'
  input.onchange = (e) => {
    const f = e.target.files[0]
    if (f) file.value = f
  }
  input.click()
}

const handleDrop = (e) => {
  isDragging.value = false
  const f = e.dataTransfer.files[0]
  if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) {
    file.value = f
  }
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

const handleImport = async () => {
  if (!file.value) return
  importing.value = true
  try {
    const res = await leadService.import(file.value)
    result.value = res.data
    emit('imported')
  } catch (err) {
    console.error('Gagal import:', err)
  } finally {
    importing.value = false
  }
}
</script>
