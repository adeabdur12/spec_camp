<template>
  <div class="space-y-4">
    <!-- Overdue -->
    <div v-if="followUps.overdue?.length > 0">
      <h4 class="text-xs font-bold uppercase tracking-wider text-error mb-2 flex items-center gap-1.5">
        <span class="material-symbols-outlined text-sm">warning</span>
        Overdue (Terlambat)
      </h4>
      <div class="space-y-2">
        <FollowUpCard v-for="lead in followUps.overdue" :key="lead.id" :lead="lead" variant="overdue"
                      @click="$emit('open-lead', lead)" @whatsapp="$emit('whatsapp', lead.whatsapp || lead.phone)" />
      </div>
    </div>

    <!-- Today -->
    <div v-if="followUps.today?.length > 0">
      <h4 class="text-xs font-bold uppercase tracking-wider text-secondary mb-2 flex items-center gap-1.5">
        <span class="material-symbols-outlined text-sm">today</span>
        Hari Ini
      </h4>
      <div class="space-y-2">
        <FollowUpCard v-for="lead in followUps.today" :key="lead.id" :lead="lead" variant="today"
                      @click="$emit('open-lead', lead)" @whatsapp="$emit('whatsapp', lead.whatsapp || lead.phone)" />
      </div>
    </div>

    <!-- This Week -->
    <div v-if="followUps.thisWeek?.length > 0">
      <h4 class="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
        <span class="material-symbols-outlined text-sm">date_range</span>
        Minggu Ini
      </h4>
      <div class="space-y-2">
        <FollowUpCard v-for="lead in followUps.thisWeek" :key="lead.id" :lead="lead" variant="week"
                      @click="$emit('open-lead', lead)" @whatsapp="$emit('whatsapp', lead.whatsapp || lead.phone)" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!followUps.overdue?.length && !followUps.today?.length && !followUps.thisWeek?.length"
         class="text-center py-12 text-on-surface-variant">
      <span class="material-symbols-outlined text-5xl mb-3 block">event_available</span>
      <p class="font-semibold">Tidak ada follow-up yang perlu dijadwalkan</p>
      <p class="text-sm mt-1">Semua target sudah terhubung atau belum ada jadwal</p>
    </div>
  </div>
</template>

<script setup>
import FollowUpCard from './FollowUpCard.vue'

defineProps({
  followUps: { type: Object, default: () => ({ overdue: [], today: [], thisWeek: [] }) }
})

defineEmits(['open-lead', 'whatsapp'])
</script>
