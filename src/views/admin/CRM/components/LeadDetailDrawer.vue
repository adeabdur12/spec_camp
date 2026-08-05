<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" @click="$emit('close')"></div>

    <!-- Drawer -->
    <div class="fixed inset-y-0 right-0 w-full max-w-[calc(100vw-1rem)] sm:w-[420px] bg-surface-container-lowest shadow-2xl z-[90] flex flex-col animate-in slide-in-from-right">
    <!-- Header -->
    <div class="p-4 border-b border-outline-variant/10 flex items-center gap-2 shrink-0">
      <div class="min-w-0 flex-1">
        <h3 class="font-bold text-on-surface truncate">{{ lead?.name }}</h3>
        <p v-if="lead?.district" class="text-xs text-on-surface-variant">{{ lead.district }}</p>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button @click="$emit('edit', lead)"
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
          <StatusBadge :status="lead?.status" />
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                :class="{
                  'bg-error/10 text-error': lead?.priority === 'high',
                  'bg-secondary/10 text-secondary': lead?.priority === 'medium',
                  'bg-surface-container-high text-on-surface-variant': lead?.priority === 'low'
                }">
            {{ lead?.priority }}
          </span>
        </div>

        <div class="space-y-2.5">
          <InfoRow icon="business" :text="lead?.type || lead?.category" />
          <InfoRow v-if="lead?.contactPerson" icon="person" :text="`${lead.contactPerson}${lead.contactRole ? ' · ' + lead.contactRole : ''}`" />
          <InfoRow v-if="lead?.phone" icon="call" :text="lead.phone" />
          <InfoRow v-if="lead?.whatsapp" icon="chat" :text="lead.whatsapp" />
          <InfoRow v-if="lead?.email" icon="mail" :text="lead.email" />
          <InfoRow v-if="lead?.address" icon="location_on" :text="lead.address" />
          <InfoRow v-if="lead?.estimatedPax" icon="group" :text="`Est. ${lead.estimatedPax} pax`" />
          <InfoRow v-if="lead?.interestedPackage" icon="local_activity" :text="lead.interestedPackage" />
        </div>

        <!-- Quick actions -->
        <div class="flex flex-wrap gap-2 pt-2">
          <a v-if="lead?.whatsapp || lead?.phone"
             :href="whatsappUrl" target="_blank"
             class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:opacity-90 transition-all">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a v-if="lead?.googleMapsUrl" :href="lead.googleMapsUrl" target="_blank"
             class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
            <span class="material-symbols-outlined text-sm">map</span>
            Maps
          </a>
          <a v-if="lead?.googleMapsUrl" :href="routeUrl" target="_blank"
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
              <p class="text-xs text-on-surface mt-1 whitespace-pre-wrap">{{ note.content }}</p>
              <p v-if="note.followUpDate" class="text-[10px] text-primary font-semibold mt-1">
                Follow-up: {{ formatDate(note.followUpDate) }}
              </p>
              <p class="text-[10px] text-on-surface-variant mt-0.5">oleh {{ note.User?.name || 'Admin' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { leadService } from '../../../../services/leadService'
import StatusBadge from './StatusBadge.vue'
import InfoRow from './InfoRow.vue'

const props = defineProps({
  lead: { type: Object, required: true }
})

defineEmits(['close', 'edit'])

const notes = ref([])
const loadingNotes = ref(true)
const showNoteForm = ref(false)
const savingNote = ref(false)
const noteForm = ref({ type: 'whatsapp', content: '', followUpDate: '' })

const whatsappUrl = computed(() => {
  const phone = props.lead?.whatsapp || props.lead?.phone
  if (!phone) return '#'
  const clean = phone.replace(/[^0-9]/g, '')
  const formatted = clean.startsWith('62') ? clean : `62${clean.startsWith('0') ? clean.slice(1) : clean}`
  return `https://wa.me/${formatted}`
})

const routeUrl = computed(() => {
  const address = [props.lead?.address, props.lead?.district, 'Sukabumi', 'Indonesia'].filter(Boolean).join(', ')
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

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const noteTypeIcon = (type) => {
  const map = { whatsapp: 'chat', telepon: 'call', visit: 'location_on', email: 'mail', catatan: 'note' }
  return map[type] || 'note'
}

const noteTypeBg = (type) => {
  const map = {
    whatsapp: 'bg-[#25D366]/10',
    telepon: 'bg-blue-100',
    visit: 'bg-yellow-100',
    email: 'bg-purple-100',
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
    catatan: 'text-on-surface-variant'
  }
  return map[type] || 'text-on-surface-variant'
}

onMounted(fetchNotes)
</script>
