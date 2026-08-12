<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" @click="$emit('close')"></div>

    <!-- Drawer -->
    <div class="fixed inset-y-0 right-0 w-full max-w-[calc(100vw-1rem)] sm:w-[420px] bg-surface-container-lowest shadow-2xl z-[90] flex flex-col animate-in slide-in-from-right">
    <!-- Header -->
    <div class="p-4 border-b border-outline-variant/10 flex items-center gap-2 shrink-0">
      <div class="min-w-0 flex-1">
        <h3 class="font-bold text-on-surface truncate">{{ leadData?.name }}</h3>
        <p v-if="leadData?.district" class="text-xs text-on-surface-variant">{{ leadData.district }}</p>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button @click="$emit('edit', leadData)"
                class="p-2 rounded-lg hover:bg-surface-container transition-all">
          <span class="material-symbols-outlined text-lg">edit</span>
        </button>
        <button @click="$emit('close')"
                class="p-2 rounded-lg hover:bg-surface-container transition-all">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <!-- Profile Section -->
      <div class="p-4 space-y-4 border-b border-outline-variant/10">
        <div class="flex items-center gap-2">
          <select @change="updateStatus($event.target.value)" :disabled="savingStatus"
                  class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border-0 focus:ring-2 focus:ring-primary/30"
                  :class="{
                    'bg-orange-100 text-orange-700': leadData?.status === 'belum_dihubungi',
                    'bg-blue-100 text-blue-700': leadData?.status === 'sudah_dihubungi',
                    'bg-green-100 text-green-700': leadData?.status === 'tertarik',
                    'bg-yellow-100 text-yellow-700': leadData?.status === 'negosiasi',
                    'bg-primary text-on-primary': leadData?.status === 'deal',
                    'bg-surface-container-high text-on-surface-variant': leadData?.status === 'tidak_tertarik'
                  }">
            <option value="belum_dihubungi" :selected="leadData?.status === 'belum_dihubungi'">Belum Dihubungi</option>
            <option value="sudah_dihubungi" :selected="leadData?.status === 'sudah_dihubungi'">Sudah Dihubungi</option>
            <option value="tertarik" :selected="leadData?.status === 'tertarik'">Tertarik</option>
            <option value="negosiasi" :selected="leadData?.status === 'negosiasi'">Negosiasi</option>
            <option value="deal" :selected="leadData?.status === 'deal'">Deal</option>
            <option value="tidak_tertarik" :selected="leadData?.status === 'tidak_tertarik'">Tidak Tertarik</option>
          </select>
          <span v-if="savingStatus" class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                :class="{
                  'bg-error/10 text-error': leadData?.priority === 'high',
                  'bg-secondary/10 text-secondary': leadData?.priority === 'medium',
                  'bg-surface-container-high text-on-surface-variant': leadData?.priority === 'low'
                }">
            {{ leadData?.priority }}
          </span>
        </div>

        <div class="space-y-2.5">
          <InfoRow icon="business" :text="leadData?.type || leadData?.category" />
          <InfoRow v-if="leadData?.contactPerson" icon="person" :text="`${leadData.contactPerson}${leadData.contactRole ? ' · ' + leadData.contactRole : ''}`" />
          <InfoRow v-if="leadData?.phone" icon="call" :text="leadData.phone" />
          <InfoRow v-if="leadData?.whatsapp" icon="chat" :text="leadData.whatsapp" />
          <InfoRow v-if="leadData?.email" icon="mail" :text="leadData.email" />
          <InfoRow v-if="leadData?.address" icon="location_on" :text="leadData.address" />
          <InfoRow v-if="leadData?.estimatedPax" icon="group" :text="`Est. ${leadData.estimatedPax} pax`" />
          <InfoRow v-if="leadData?.interestedPackage" icon="local_activity" :text="leadData.interestedPackage" />
        </div>

        <!-- Quick actions -->
        <div class="flex flex-wrap gap-2 pt-2">
          <a v-if="leadData?.whatsapp || leadData?.phone"
             :href="whatsappUrl" target="_blank"
             class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:opacity-90 transition-all">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
           <a v-if="leadData?.facebookUrl" :href="leadData.facebookUrl" target="_blank"
             class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition-all">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
           <a v-if="leadData?.instagramUrl" :href="leadData.instagramUrl" target="_blank"
             class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-pink-600/10 text-pink-600 hover:bg-pink-600/20 transition-all">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </a>
          <a v-if="leadData?.googleMapsUrl" :href="routeUrl" target="_blank"
             class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all">
            <span class="material-symbols-outlined text-sm">directions</span>
            Rute
          </a>
        </div>
      </div>

      <!-- Notes Timeline -->
      <div class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-bold text-sm text-on-surface">Riwayat Interaksi</h4>
          <button @click="showNoteForm = !showNoteForm"
                  class="text-xs font-bold text-primary hover:underline">
            + Tambah
          </button>
        </div>

        <!-- Add Note Form -->
        <div v-if="showNoteForm" class="bg-surface-container-low rounded-xl p-3 mb-3 space-y-2">
          <select v-model="noteForm.type"
                  class="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border-0 text-xs focus:ring-2 focus:ring-primary/30">
            <option value="whatsapp">WhatsApp</option>
            <option value="telepon">Telepon</option>
            <option value="visit">Kunjungan</option>
            <option value="email">Email</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="catatan">Catatan</option>
          </select>
          <textarea v-model="noteForm.content" rows="3" placeholder="Isi catatan interaksi..."
                    class="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border-0 text-xs focus:ring-2 focus:ring-primary/30 resize-none"></textarea>
          <input v-model="noteForm.followUpDate" type="date"
                 class="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border-0 text-xs focus:ring-2 focus:ring-primary/30" />
          <div class="flex gap-2">
            <button @click="submitNote" :disabled="!noteForm.content || savingNote"
                    class="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-40">
              {{ savingNote ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button @click="showNoteForm = false"
                    class="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container-highest">
              Batal
            </button>
          </div>
        </div>

        <!-- Timeline -->
        <div v-if="loadingNotes" class="flex justify-center py-4">
          <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="notes.length === 0" class="text-center py-6 text-on-surface-variant text-xs">
          Belum ada riwayat interaksi
        </div>
        <div v-else class="space-y-3">
          <div v-for="note in notes" :key="note.id" class="flex gap-3">
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                   :class="noteTypeBg(note.type)">
                <span class="material-symbols-outlined text-sm" :class="noteTypeText(note.type)">{{ noteTypeIcon(note.type) }}</span>
              </div>
              <div class="w-px flex-1 bg-outline-variant/30 mt-1"></div>
            </div>
            <div class="pb-3 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider" :class="noteTypeText(note.type)">{{ note.type }}</span>
                <span class="text-[10px] text-on-surface-variant">{{ formatDateTime(note.createdAt) }}</span>
              </div>
              <template v-if="editingNoteId === note.id">
                <div class="space-y-2 mt-1">
                  <select v-model="editNoteForm.type"
                          class="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border-0 text-xs focus:ring-2 focus:ring-primary/30">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telepon">Telepon</option>
                    <option value="visit">Kunjungan</option>
                    <option value="email">Email</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="catatan">Catatan</option>
                  </select>
                  <textarea v-model="editNoteForm.content" rows="2" class="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border-0 text-xs focus:ring-2 focus:ring-primary/30 resize-none"></textarea>
                  <input v-model="editNoteForm.followUpDate" type="date" class="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border-0 text-xs focus:ring-2 focus:ring-primary/30" />
                  <div class="flex gap-2">
                    <button @click="saveEditNote(note.id)" class="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90">Simpan</button>
                    <button @click="editingNoteId = null" class="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold">Batal</button>
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="text-xs text-on-surface mt-1 whitespace-pre-wrap">{{ note.content }}</p>
                <p v-if="note.followUpDate" class="text-[10px] text-primary font-semibold mt-1">
                  Follow-up: {{ formatDate(note.followUpDate) }}
                </p>
                <p class="text-[10px] text-on-surface-variant mt-0.5">oleh {{ note.User?.name || 'Admin' }}</p>
                <div class="flex gap-1 mt-1">
                  <button @click="startEditNote(note)" class="text-[10px] font-bold text-primary hover:underline">Edit</button>
                  <span class="text-[10px] text-outline-variant">|</span>
                  <button @click="removeNote(note.id)" class="text-[10px] font-bold text-error hover:underline">Hapus</button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>

  <ConfirmModal :show="showDeleteConfirm" title="Hapus Catatan" message="Apakah Anda yakin ingin menghapus catatan ini?"
                 @confirm="executeDeleteNote" @cancel="showDeleteConfirm = false" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { leadService } from '../../../../services/leadService'
import InfoRow from './InfoRow.vue'
import ConfirmModal from '../../../../components/admin/ConfirmModal.vue'

const props = defineProps({
  lead: { type: Object, required: true }
})

defineEmits(['close', 'edit'])

const leadData = ref({ ...props.lead })
const loadingLead = ref(false)

const fetchLeadDetail = async () => {
  loadingLead.value = true
  try {
    const res = await leadService.getById(props.lead.id)
    if (res.data) leadData.value = res.data
  } catch (err) {
    console.error('Gagal mengambil detail lead:', err)
  } finally {
    loadingLead.value = false
  }
}

const updateStatus = async (newStatus) => {
  savingStatus.value = true
  try {
    await leadService.update(props.lead.id, { status: newStatus })
    leadData.value = { ...leadData.value, status: newStatus }
  } catch (err) {
    console.error('Gagal update status:', err)
  } finally {
    savingStatus.value = false
  }
}

const notes = ref([])
const loadingNotes = ref(true)
const showNoteForm = ref(false)
const savingNote = ref(false)
const noteForm = ref({ type: 'whatsapp', content: '', followUpDate: '' })
const editingNoteId = ref(null)
const editNoteForm = ref({ type: 'whatsapp', content: '', followUpDate: '' })
const showDeleteConfirm = ref(false)
const noteToDelete = ref(null)
const savingStatus = ref(false)

const whatsappUrl = computed(() => {
  const phone = leadData.value?.whatsapp || leadData.value?.phone
  if (!phone) return '#'
  const clean = phone.replace(/[^0-9]/g, '')
  const formatted = clean.startsWith('62') ? clean : `62${clean.startsWith('0') ? clean.slice(1) : clean}`
  return `https://wa.me/${formatted}`
})

const routeUrl = computed(() => {
  const address = [leadData.value?.address, leadData.value?.district, 'Sukabumi', 'Indonesia'].filter(Boolean).join(', ')
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
})

const fetchNotes = async () => {
  try {
    const res = await leadService.getNotes(props.lead.id)
    notes.value = res.data || []
  } catch (err) {
    console.error('Gagal mengambil catatan:', err)
  } finally {
    loadingNotes.value = false
  }
}

const submitNote = async () => {
  savingNote.value = true
  try {
    await leadService.addNote(props.lead.id, noteForm.value)
    noteForm.value = { type: 'whatsapp', content: '', followUpDate: '' }
    showNoteForm.value = false
    await fetchNotes()
  } catch (err) {
    console.error('Gagal menyimpan catatan:', err)
  } finally {
    savingNote.value = false
  }
}

const startEditNote = (note) => {
  editingNoteId.value = note.id
  editNoteForm.value = {
    type: note.type,
    content: note.content,
    followUpDate: note.followUpDate || ''
  }
}

const saveEditNote = async (noteId) => {
  try {
    await leadService.updateNote(noteId, editNoteForm.value)
    editingNoteId.value = null
    await fetchNotes()
  } catch (err) {
    console.error('Gagal mengedit catatan:', err)
  }
}

const removeNote = (noteId) => {
  noteToDelete.value = noteId
  showDeleteConfirm.value = true
}

const executeDeleteNote = async () => {
  if (!noteToDelete.value) return
  try {
    await leadService.deleteNote(noteToDelete.value)
    await fetchNotes()
  } catch (err) {
    console.error('Gagal menghapus catatan:', err)
  } finally {
    showDeleteConfirm.value = false
    noteToDelete.value = null
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const noteTypeIcon = (type) => {
  const map = { whatsapp: 'chat', telepon: 'call', visit: 'location_on', email: 'mail', facebook: 'thumb_up', instagram: 'photo_camera', catatan: 'note' }
  return map[type] || 'note'
}

const noteTypeBg = (type) => {
  const map = {
    whatsapp: 'bg-[#25D366]/10',
    telepon: 'bg-blue-100',
    visit: 'bg-yellow-100',
    email: 'bg-purple-100',
    facebook: 'bg-blue-600/10',
    instagram: 'bg-pink-600/10',
    catatan: 'bg-surface-container-high'
  }
  return map[type] || 'bg-surface-container-high'
}

const noteTypeText = (type) => {
  const map = {
    whatsapp: 'text-[#25D366]',
    telepon: 'text-blue-700',
    visit: 'text-yellow-700',
    email: 'text-purple-700',
    facebook: 'text-blue-600',
    instagram: 'text-pink-600',
    catatan: 'text-on-surface-variant'
  }
  return map[type] || 'text-on-surface-variant'
}

onMounted(() => {
  fetchLeadDetail()
  fetchNotes()
})
</script>
