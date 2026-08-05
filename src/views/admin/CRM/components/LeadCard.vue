<template>
  <div @click="$emit('click')"
       class="bg-surface-container-lowest rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group relative overflow-hidden">
    <!-- Priority indicator -->
    <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl"
         :class="{
           'bg-error': lead.priority === 'high',
           'bg-secondary': lead.priority === 'medium',
           'bg-outline-variant': lead.priority === 'low'
         }"></div>

    <div class="pl-3 space-y-3">
      <!-- Header -->
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="font-bold text-sm text-on-surface truncate">{{ lead.name }}</h3>
          <p v-if="lead.district" class="text-xs text-on-surface-variant mt-0.5">{{ lead.district }}</p>
        </div>
        <StatusBadge :status="lead.status" />
      </div>

      <!-- Info -->
      <div class="space-y-1">
        <div v-if="lead.contactPerson" class="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span class="material-symbols-outlined text-sm">person</span>
          <span class="truncate">{{ lead.contactPerson }}<span v-if="lead.contactRole"> &middot; {{ lead.contactRole }}</span></span>
        </div>
        <div v-if="lead.type || lead.category" class="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span class="material-symbols-outlined text-sm">business</span>
          <span class="truncate capitalize">{{ lead.type || lead.category }}</span>
        </div>
        <div v-if="lead.estimatedPax" class="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span class="material-symbols-outlined text-sm">group</span>
          <span>Est. {{ lead.estimatedPax }} pax</span>
        </div>
      </div>

      <!-- Follow-up date -->
      <div v-if="lead.nextFollowUpDate"
           class="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg w-fit"
           :class="isOverdue ? 'bg-error/10 text-error' : isToday ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'">
        <span class="material-symbols-outlined text-sm">event</span>
        <span class="font-semibold">{{ formatDate(lead.nextFollowUpDate) }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 pt-1 border-t border-outline-variant/10" @click.stop>
        <button @click="$emit('whatsapp')"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                :class="{ 'opacity-30 pointer-events-none': !lead.whatsapp && !lead.phone }">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span class="hidden sm:inline">WA</span>
        </button>
        <button @click="$emit('edit')"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
          <span class="material-symbols-outlined text-sm">edit</span>
          <span class="hidden sm:inline">Edit</span>
        </button>
        <button @click="$emit('delete')"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-error/10 text-error hover:bg-error/20 transition-all ml-auto">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  lead: { type: Object, required: true }
})

defineEmits(['click', 'edit', 'delete', 'whatsapp'])

const isOverdue = (() => {
  if (!props.lead.nextFollowUpDate) return false
  return new Date(props.lead.nextFollowUpDate) < new Date(new Date().toDateString())
})()

const isToday = (() => {
  if (!props.lead.nextFollowUpDate) return false
  return new Date(props.lead.nextFollowUpDate).toDateString() === new Date().toDateString()
})()

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
