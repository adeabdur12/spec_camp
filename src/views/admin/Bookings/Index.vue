<template>
  <DashboardLayout title="Manajemen Reservasi">
    <div class="space-y-3 md:space-y-6 max-w-7xl mx-auto pb-10">
      <!-- Page Header Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h2 class="text-2xl md:text-2xl font-black tracking-tight text-primary font-headline uppercase">Manajemen Reservasi</h2>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium">Kelola jadwal tamu, status, dan pendapatan operasional.</p>
        </div>
        <button @click="openModal()" 
                class="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined mr-2" data-icon="add">add</span>
          Buat Reservasi Baru
        </button>
      </div>

      <!-- Loading State (only for initial load) -->
      <div v-if="loading && bookings.length === 0" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <!-- Dashboard Stats -->
        <BookingStats 
          :total-revenue="totalRevenue"
          :confirmed-count="confirmedBookings.length"
          :pending-count="pendingBookings.length"
          :total-count="bookings.length"
          @filter-pending="filter = 'pending'"
        />

        <!-- Booking List -->
        <BookingList 
          :bookings="bookings"
          :filter="filter"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          :total-items="totalItems"
          :total-pages="totalPages"
          :status-open-id="statusOpenId"
          :actions-open-id="actionsOpenId"
          :copied-id="copiedId"
          :settlements="settlements"
          :loading="loading"
          @update:filter="filter = $event"
          @toggle-status="toggleStatus"
          @update-status="updateStatus"
          @view-detail="viewDetail"
          @copy-link="copyBookingLink"
          @toggle-actions="toggleActions"
          @edit="openModal"
          @delete="deleteBooking"
          @prev-page="prevPage"
          @next-page="nextPage"
          @go-to-page="goToPage"
        >
          <template #filters>
            <BookingFilters v-model="filter" />
          </template>
        </BookingList>
      </template>

      <!-- Form Modal -->
      <BookingFormModal 
        v-if="showModal"
        :form="form" 
        :editing-id="editingId" 
        :saving="saving"
        :error-message="errorMessage" 
        :packages="packages"
        :customers="customers" 
        :service-list="serviceList"
        :inventory-list="inventoryList"
        @close="closeModal" 
        @save="saveBooking"
      />

      <!-- Detail Modal -->
      <BookingDetailModal 
        :booking="detailBooking"
        :is-settled="detailBooking ? isBookingSettled(detailBooking) : false"
        :copied-id="copiedId"
        @close="closeDetailModal"
        @copy-link="copyBookingLink"
        @preview-image="showImagePreview = $event"
      />

      <!-- Image Preview -->
      <BookingImagePreview 
        :image-url="showImagePreview"
        @close="showImagePreview = null"
      />

      <!-- Confirm Modal -->
      <ConfirmModal 
        :show="showConfirm" 
        :title="confirmTitle" 
        :message="confirmMessage" 
        @confirm="executeDelete" 
        @cancel="showConfirm = false" 
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../../components/admin/DashboardLayout.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import BookingFormModal from './components/BookingFormModal.vue'
import BookingStats from './components/BookingStats.vue'
import BookingFilters from './components/BookingFilters.vue'
import BookingCard from './components/BookingCard.vue'
import BookingList from './components/BookingList.vue'
import BookingDetailModal from './components/BookingDetailModal.vue'
import BookingImagePreview from './components/BookingImagePreview.vue'
import { useBookings } from './composables/useBookings'

const {
  loading,
  saving,
  bookings,
  packages,
  customers,
  serviceList,
  inventoryList,
  settlements,
  showModal,
  editingId,
  errorMessage,
  filter,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  showConfirm,
  confirmTitle,
  confirmMessage,
  statusOpenId,
  actionsOpenId,
  showDetail,
  detailBooking,
  showImagePreview,
  copiedId,
  form,
  confirmedBookings,
  pendingBookings,
  totalRevenue,
  openModal,
  closeModal,
  saveBooking,
  updateStatus,
  deleteBooking,
  executeDelete,
  viewDetail,
  closeDetailModal,
  copyBookingLink,
  isBookingSettled,
  goToPage,
  nextPage,
  prevPage,
  toggleStatus,
  toggleActions
} = useBookings()
</script>
