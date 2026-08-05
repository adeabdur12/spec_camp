<template>
  <DashboardLayout title="CRM Marketing">
    <div class="space-y-4 md:space-y-6 max-w-7xl mx-auto pb-10 overflow-x-hidden">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div class="space-y-1">
          <h2 class="text-2xl md:text-2xl font-black tracking-tight text-primary font-headline uppercase">CRM Lead Management</h2>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium">Kelola data target pemasaran, follow-up, dan prospek pelanggan.</p>
        </div>
        <div class="flex gap-2">
          <button @click="showImportModal = true"
                  class="bg-secondary text-on-secondary px-3 sm:px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 text-xs sm:text-sm">
            <span class="material-symbols-outlined text-lg">upload_file</span>
            <span class="hidden sm:inline">Import Excel</span>
            <span class="sm:hidden">Import</span>
          </button>
          <button @click="openModal()"
                  class="bg-primary text-on-primary px-3 sm:px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10 text-xs sm:text-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            <span class="hidden sm:inline">Tambah Lead</span>
            <span class="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-surface-container-low rounded-xl p-1 w-fit">
        <button @click="activeTab = 'leads'"
                class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                :class="activeTab === 'leads' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container'">
          Semua Lead
        </button>
        <button @click="activeTab = 'followup'"
                class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative"
                :class="activeTab === 'followup' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container'">
          Jadwal Follow-up
          <span v-if="totalFollowUp > 0"
                class="ml-1.5 bg-error text-on-error text-[10px] px-1.5 py-0.5 rounded-full font-black">
            {{ totalFollowUp }}
          </span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && leads.length === 0 && activeTab === 'leads'" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <!-- Leads Tab -->
        <template v-if="activeTab === 'leads'">
          <!-- Stats -->
          <LeadStats :stats="stats" />

          <!-- Filters -->
          <div class="bg-surface-container-low rounded-xl p-3 md:p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                <input v-model="search" type="text" placeholder="Cari nama, kecamatan, PIC..."
                       class="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50" />
              </div>
              <select v-model="statusFilter"
                      class="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30">
                <option value="all">Semua Status</option>
                <option value="belum_dihubungi">Belum Dihubungi</option>
                <option value="sudah_dihubungi">Sudah Dihubungi</option>
                <option value="tertarik">Tertarik</option>
                <option value="negosiasi">Negosiasi</option>
                <option value="deal">Deal</option>
                <option value="tidak_tertarik">Tidak Tertarik</option>
              </select>
              <select v-model="categoryFilter"
                      class="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30">
                <option value="all">Semua Kategori</option>
                <option value="sekolah">Sekolah</option>
                <option value="perusahaan">Perusahaan</option>
                <option value="komunitas">Komunitas</option>
                <option value="instansi">Instansi</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <select v-model="priorityFilter"
                      class="w-full px-3 py-2.5 bg-surface-container-lowest rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary/30">
                <option value="all">Semua Prioritas</option>
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>
            </div>
          </div>

          <!-- Lead Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <LeadCard v-for="lead in leads" :key="lead.id" :lead="lead"
                      @click="openDrawer(lead)"
                      @edit="openModal(lead)"
                      @delete="deleteLead(lead)"
                      @whatsapp="openWhatsApp(lead.whatsapp || lead.phone)" />
          </div>

          <div v-if="leads.length === 0 && !loading" class="text-center py-12 text-on-surface-variant">
            <span class="material-symbols-outlined text-5xl mb-3 block">person_search</span>
            <p class="font-semibold">Belum ada data leads</p>
            <p class="text-sm mt-1">Tambah lead baru atau import dari file Excel</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between bg-surface-container-low rounded-xl p-3 gap-2">
            <p class="text-xs text-on-surface-variant">
              {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalItems) }} / {{ totalItems }}
            </p>
            <div class="flex gap-1">
              <button @click="prevPage" :disabled="currentPage <= 1"
                      class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30 hover:bg-surface-container-high">
                Sebelumnya
              </button>
              <button v-for="p in Math.min(totalPages, 5)" :key="p" @click="goToPage(p)"
                      class="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                      :class="p === currentPage ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high'">
                {{ p }}
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages"
                      class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30 hover:bg-surface-container-high">
                Selanjutnya
              </button>
            </div>
          </div>
        </template>

        <!-- Follow-up Tab -->
        <template v-if="activeTab === 'followup'">
          <FollowUpSection :follow-ups="followUps" @open-lead="openDrawer" @whatsapp="openWhatsApp" />
        </template>
      </template>

      <!-- Modals -->
      <LeadFormModal v-if="showModal" :form="form" :editing="!!editingLead" :saving="saving"
                     @close="closeModal" @save="saveLead" />

      <ImportExcelModal v-if="showImportModal" @close="showImportModal = false" @imported="onImported" />

      <LeadDetailDrawer v-if="showDrawer" :lead="selectedLead" @close="closeDrawer"
                         @edit="(l) => { closeDrawer(); openModal(l) }" />

      <ConfirmModal :show="showConfirm" :title="confirmTitle" :message="confirmMessage"
                    @confirm="executeDelete" @cancel="showConfirm = false" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import LeadCard from './components/LeadCard.vue'
import LeadFormModal from './components/LeadFormModal.vue'
import ImportExcelModal from './components/ImportExcelModal.vue'
import LeadDetailDrawer from './components/LeadDetailDrawer.vue'
import LeadStats from './components/LeadStats.vue'
import FollowUpSection from './components/FollowUpSection.vue'
import { useCRM } from '../../../composables/useCRM'
import { computed } from 'vue'

const {
  loading,
  saving,
  leads,
  stats,
  followUps,
  activeTab,
  search,
  statusFilter,
  categoryFilter,
  priorityFilter,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  showModal,
  showImportModal,
  showDrawer,
  selectedLead,
  editingLead,
  showConfirm,
  confirmTitle,
  confirmMessage,
  form,
  fetchLeads,
  fetchStats,
  fetchFollowUps,
  openModal,
  closeModal,
  saveLead,
  deleteLead,
  executeDelete,
  openDrawer,
  closeDrawer,
  goToPage,
  nextPage,
  prevPage,
  openWhatsApp
} = useCRM()

const totalFollowUp = computed(() => {
  return (followUps.value?.overdue?.length || 0) + (followUps.value?.today?.length || 0)
})

const onImported = async () => {
  showImportModal.value = false
  await fetchLeads()
  await fetchStats()
}
</script>

<style>
html, body {
  overflow-x: hidden;
}
</style>
