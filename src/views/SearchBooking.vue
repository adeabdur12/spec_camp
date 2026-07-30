<template>
  <div class="bg-background text-on-background font-body antialiased min-h-screen">
    <header class="bg-surface-container-lowest border-b border-outline-variant/10">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="font-headline text-xl font-black text-primary tracking-tight">Cari Booking</h1>
        <router-link to="/" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Kembali
        </router-link>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-6 py-8">
      <!-- Search -->
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
        <label class="text-xs font-bold text-primary uppercase tracking-widest mb-3 block">Masukkan Kode Booking</label>
        <div class="flex flex-col sm:flex-row gap-3">
          <input v-model="searchCode" type="text" maxlength="5"
                 class="w-full sm:flex-1 bg-surface-container border-none px-4 py-3 rounded-xl text-base sm:text-lg font-bold text-center tracking-[0.3em] focus:ring-2 focus:ring-primary/20 uppercase"
                 placeholder="00000" @keydown.enter.prevent="searchBooking">
          <button @click="searchBooking" :disabled="searching || !searchCode.trim()"
                  class="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
            <span v-if="searching" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Cari
          </button>
        </div>
        <p v-if="searchError" class="mt-3 text-xs text-error font-medium">{{ searchError }}</p>
      </div>

      <!-- Booking Detail -->
      <div v-if="booking" class="mt-6 space-y-6">

        <!-- Confirmed: Show Ticket -->
        <div v-if="booking.status === 'confirmed'">
          <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 flex flex-col md:flex-row">
            <!-- Left: Green Side -->
            <div class="md:w-2/5 bg-[#3c513e] px-5 py-5 md:py-6 relative flex flex-col justify-between">
              <div>
                <div class="bg-[#2d3a2e] text-white text-[9px] px-2.5 py-0.5 inline-block mb-2 tracking-wider font-semibold">TIKET MASUK</div>
                <h1 class="text-[#e68e54] text-lg font-black leading-tight">Camping Ground</h1>
                <h2 class="text-white text-2xl font-black tracking-widest">SPEC CAMP</h2>
              </div>
              <div class="mt-4 md:mt-0">
                <p class="text-white/50 text-[8px] uppercase tracking-wider mb-0.5">Kode Tiket</p>
                <div class="bg-white/10 backdrop-blur rounded-lg px-3 py-2 border border-white/10">
                  <p class="text-white font-bold text-base tracking-wider">#{{ booking.bookingCode }}</p>
                </div>
              </div>
            </div>

            <!-- Dashed separator (desktop) -->
            <div class="hidden md:block w-1 border-l-2 border-dashed border-gray-300 bg-white relative shrink-0">
              <div class="absolute -top-3 -left-2.5 w-5 h-5 bg-gray-100 rounded-full"></div>
              <div class="absolute -bottom-3 -left-2.5 w-5 h-5 bg-gray-100 rounded-full"></div>
            </div>

            <!-- Right: Details -->
            <div class="md:flex-1 px-5 py-4 md:py-5 relative overflow-hidden bg-white"
                 :style="{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url(\'/image/spec_camp4.jpeg\')', backgroundSize: 'cover', backgroundPosition: 'center' }">
              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-3">
                  <img src="/logo/logo.svg" class="h-6 w-auto" alt="SPEC CAMP">
                  <span class="text-sm font-bold text-gray-800 tracking-tight">SPEC CAMP</span>
                </div>

              <h1 class="text-[#2d3a2e] text-sm font-black leading-tight uppercase tracking-tight mb-2">Sukabumi Prestige Equestrian Center</h1>

              <div class="flex items-start gap-1.5 text-gray-500 text-[10px] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-[#3c513e] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Kp. Cipari, Tenjolaya, Cicurug, Kab. Sukabumi</span>
              </div>

              <div class="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 pt-3">
                <div>
                  <p class="text-[8px] text-gray-400 uppercase tracking-wider">Pemilik</p>
                  <p class="text-xs font-bold text-gray-800 truncate">{{ booking.customerName }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-gray-400 uppercase tracking-wider">No. Telepon</p>
                  <p class="text-xs font-bold text-gray-800">{{ booking.phone || '-' }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-gray-400 uppercase tracking-wider">Check In</p>
                  <p class="text-xs font-bold text-gray-800">{{ formatDate(booking.checkInDate) }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-gray-400 uppercase tracking-wider">Check Out</p>
                  <p class="text-xs font-bold text-gray-800">{{ formatDate(booking.checkOutDate) }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-gray-400 uppercase tracking-wider">Tamu</p>
                  <p class="text-xs font-bold text-gray-800">{{ booking.pax }} Orang <span v-if="booking.freePax > 0" class="text-emerald-600">({{ booking.freePax }} gratis)</span></p>
                </div>
                <div v-if="booking.PackageEvent">
                  <p class="text-[8px] text-gray-400 uppercase tracking-wider">Paket</p>
                  <p class="text-xs font-bold text-gray-800 truncate">{{ booking.PackageEvent.name }}</p>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="booking.notes" class="border-t border-gray-100 pt-3 mt-3">
                <p class="text-[8px] text-gray-400 uppercase tracking-wider mb-1">Catatan</p>
                <p class="text-xs text-gray-600">{{ booking.notes }}</p>
              </div>

              <!-- Inventory Items -->
              <div v-if="booking.InventoryItems?.length" class="border-t border-gray-100 pt-3 mt-3">
                <p class="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">Sewa Alat Camping</p>
                <div v-for="i in booking.InventoryItems" :key="i.id" class="flex justify-between text-xs py-1">
                  <span>{{ i.name }}</span>
                  <span class="font-bold">{{ i.BookingInventory?.quantity }}x {{ formatCurrency(i.BookingInventory?.priceAtBooking || i.price) }}</span>
                </div>
              </div>

              <!-- Extra Services -->
              <div v-if="booking.ExtraServices?.length" class="border-t border-gray-100 pt-3 mt-3">
                <p class="text-[9px] font-bold text-primary uppercase tracking-wider mb-2">Layanan Ekstra</p>
                <div v-for="s in booking.ExtraServices" :key="s.id" class="flex justify-between text-xs py-1">
                  <span>{{ s.name }}</span>
                  <span class="font-bold">{{ s.BookingService?.quantity }}x {{ formatCurrency(s.BookingService?.priceAtBooking || s.price) }}</span>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="border-t border-gray-100 pt-3 mt-3 space-y-1">
                <div v-if="booking.PackageEvent" class="flex justify-between text-xs">
                  <span class="text-gray-500">{{ booking.PackageEvent.name }} ({{ formatCurrency(booking.PackageEvent.pricePerPax) }} x {{ booking.pax }} {{ booking.PackageEvent.perPerson }})</span>
                  <span class="font-bold text-gray-800">{{ formatCurrency(Number(booking.PackageEvent.pricePerPax) * booking.pax) }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                <span class="text-sm font-bold text-gray-800">Total</span>
                <span class="text-lg font-black text-primary">{{ formatCurrency(booking.totalPrice) }}</span>
              </div>
            </div>
          </div>
          </div>

        </div>

        <!-- Completed: Show full detail -->
        <div v-else-if="booking.status === 'completed'" class="space-y-4">
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 text-center">
            <span class="material-symbols-outlined text-5xl text-emerald-600 mb-3">task_alt</span>
            <h2 class="font-headline text-2xl font-black text-emerald-800 mb-2">Kegiatan Selesai</h2>
            <p class="text-on-surface-variant text-sm">Terima kasih telah berkemah di SPEC CAMP. Sampai jumpa kembali!</p>
          </div>

          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
            <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-3">Detail Pesanan</h3>
            <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <span class="text-on-surface-variant">Nama:</span>
              <span class="font-medium text-right">{{ booking.customerName }}</span>
              <span class="text-on-surface-variant">No. Telepon:</span>
              <span class="font-medium text-right">{{ booking.phone || '-' }}</span>
              <span class="text-on-surface-variant">Paket:</span>
              <span class="font-medium text-right">{{ booking.PackageEvent?.name || '-' }}</span>
              <span class="text-on-surface-variant">Check In:</span>
              <span class="font-medium text-right">{{ formatDate(booking.checkInDate) }}</span>
              <span class="text-on-surface-variant">Check Out:</span>
              <span class="font-medium text-right">{{ formatDate(booking.checkOutDate) }}</span>
              <span class="text-on-surface-variant">Tamu:</span>
              <span class="font-medium text-right">{{ booking.pax }} {{ booking.PackageEvent.perPerson}} <span v-if="booking.freePax > 0" class="text-emerald-600">({{ booking.freePax }} gratis)</span></span>
              <span class="text-on-surface-variant">Status:</span>
              <span class="font-semibold text-right text-emerald-600">{{ translateStatus(booking.status) }}</span>
            </div>

            <div v-if="booking.notes" class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Catatan</p>
              <p class="text-sm text-on-surface-variant">{{ booking.notes }}</p>
            </div>

            <div v-if="booking.InventoryItems?.length" class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">Sewa Alat Camping</p>
              <div v-for="i in booking.InventoryItems" :key="i.id" class="flex justify-between text-xs py-1">
                <span>{{ i.name }}</span>
                <span class="font-bold">{{ i.BookingInventory?.quantity }}x {{ formatCurrency(i.BookingInventory?.priceAtBooking || i.price) }}</span>
              </div>
            </div>

            <div v-if="booking.ExtraServices?.length" class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-primary uppercase tracking-wider mb-2">Layanan Ekstra</p>
              <div v-for="s in booking.ExtraServices" :key="s.id" class="flex justify-between text-xs py-1">
                <span>{{ s.name }}</span>
                <span class="font-bold">{{ s.BookingService?.quantity }}x {{ formatCurrency(s.BookingService?.priceAtBooking || s.price) }}</span>
              </div>
            </div>

            <div class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bukti Pembayaran</p>
              <div v-if="booking.paymentProof" class="rounded-lg overflow-hidden border border-outline-variant/10 cursor-pointer" @click="showImagePreview = booking.paymentProof">
                <img :src="booking.paymentProof" alt="Bukti Pembayaran" class="w-full max-h-64 object-contain bg-white">
              </div>
              <p v-else class="text-xs text-on-surface-variant italic">Belum ada bukti pembayaran</p>
            </div>

            <div class="border-t border-outline-variant/10 pt-3 mt-3 space-y-1">
              <div v-if="booking.PackageEvent" class="flex justify-between text-xs">
                <span class="text-on-surface-variant">{{ booking.PackageEvent.name }} ({{ formatCurrency(booking.PackageEvent.pricePerPax) }} x {{ booking.pax }} pax)</span>
                <span class="font-bold text-on-surface">{{ formatCurrency(Number(booking.PackageEvent.pricePerPax) * booking.pax) }}</span>
              </div>
            </div>

            <div class="border-t border-outline-variant/10 pt-3 mt-3 flex justify-between">
              <span class="font-bold text-on-surface">Total</span>
              <span class="font-bold text-primary text-lg">{{ formatCurrency(booking.totalPrice) }}</span>
            </div>
          </div>

        </div>

        <!-- Pending: Details + Payment -->
        <div v-else class="space-y-6">
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
            <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-3">Detail Pesanan</h3>
            <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <span class="text-on-surface-variant">Nama:</span>
              <span class="font-medium text-right">{{ booking.customerName }}</span>
              <span class="text-on-surface-variant">No. Telepon:</span>
              <span class="font-medium text-right">{{ booking.phone || '-' }}</span>
              <span class="text-on-surface-variant">Paket:</span>
              <span class="font-medium text-right">{{ booking.PackageEvent?.name || '-' }}</span>
              <span class="text-on-surface-variant">Check In:</span>
              <span class="font-medium text-right">{{ formatDate(booking.checkInDate) }}</span>
              <span class="text-on-surface-variant">Check Out:</span>
              <span class="font-medium text-right">{{ formatDate(booking.checkOutDate) }}</span>
              <span class="text-on-surface-variant">Tamu:</span>
              <span class="font-medium text-right">{{ booking.pax }} orang <span v-if="booking.freePax > 0" class="text-emerald-600">({{ booking.freePax }} gratis)</span></span>
              <span class="text-on-surface-variant">Status:</span>
              <span class="font-semibold text-right text-amber-600">{{ translateStatus(booking.status) }}</span>
            </div>

            <div v-if="booking.notes" class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Catatan</p>
              <p class="text-sm text-on-surface-variant">{{ booking.notes }}</p>
            </div>

            <div v-if="booking.InventoryItems?.length" class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">Sewa Alat Camping</p>
              <div v-for="i in booking.InventoryItems" :key="i.id" class="flex justify-between text-xs py-1">
                <span>{{ i.name }}</span>
                <span class="font-bold">{{ i.BookingInventory?.quantity }}x {{ formatCurrency(i.BookingInventory?.priceAtBooking || i.price) }}</span>
              </div>
            </div>

            <div v-if="booking.ExtraServices?.length" class="border-t border-outline-variant/10 pt-3 mt-3">
              <p class="text-[9px] font-bold text-primary uppercase tracking-wider mb-2">Layanan Ekstra</p>
              <div v-for="s in booking.ExtraServices" :key="s.id" class="flex justify-between text-xs py-1">
                <span>{{ s.name }}</span>
                <span class="font-bold">{{ s.BookingService?.quantity }}x {{ formatCurrency(s.BookingService?.priceAtBooking || s.price) }}</span>
              </div>
            </div>

            <div class="border-t border-outline-variant/10 pt-3 mt-3 space-y-1">
              <div v-if="booking.PackageEvent" class="flex justify-between text-xs">
                <span class="text-on-surface-variant">{{ booking.PackageEvent.name }} ({{ formatCurrency(booking.PackageEvent.pricePerPax) }} x {{ booking.pax }} pax)</span>
                <span class="font-bold text-on-surface">{{ formatCurrency(Number(booking.PackageEvent.pricePerPax) * booking.pax) }}</span>
              </div>
            </div>

            <div class="border-t border-outline-variant/10 pt-3 mt-3 flex justify-between">
              <span class="font-bold text-on-surface">Total</span>
              <span class="font-bold text-primary text-lg">{{ formatCurrency(booking.totalPrice) }}</span>
            </div>
          </div>

          <!-- Pembayaran -->
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
            <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">Pembayaran</h3>

            <div class="bg-surface-container rounded-xl p-5 space-y-2 mb-4">
              <p class="text-xs text-on-surface-variant">Transfer ke Rekening</p>
              <p class="font-bold text-on-surface text-sm">PT Bumimakmur Jaya Sentosa</p>
              <div class="border-t border-outline-variant/10 pt-3 mt-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                    <span class="text-yellow-700 font-black text-xs">M</span>
                  </div>
                  <div>
                    <p class="text-[10px] text-on-surface-variant font-medium">Bank Mandiri</p>
                    <p class="font-bold text-on-surface text-sm">157-00-3199999-9</p>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs text-on-surface-variant mb-4">Upload screenshot atau foto bukti transfer agar pesanan segera diproses.</p>

            <div v-if="!booking.paymentProof" class="border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer" @click="triggerUpload">
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect">
              <span class="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2">cloud_upload</span>
              <p class="text-sm font-medium text-on-surface-variant">Klik untuk upload bukti bayar</p>
              <p class="text-[10px] text-on-surface-variant/40 mt-1">Maks 5MB, format gambar</p>
            </div>

            <div v-else class="space-y-3">
              <div class="relative bg-surface-container rounded-xl overflow-hidden">
                <img :src="booking.paymentProof" alt="Bukti Pembayaran" class="w-full max-h-64 object-contain">
              </div>
              <p class="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                Bukti pembayaran terupload
              </p>
            </div>

            <div v-if="uploadError" class="mt-3 bg-error-container text-on-error-container p-3 rounded-xl text-xs font-medium">{{ uploadError }}</div>
          </div>
        </div>

        <!-- Lokasi -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
          <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">location_on</span>
            Lokasi Spec Camp
          </h3>
          <p class="text-xs text-on-surface-variant mb-3">Sukabumi Prestige Equestrian Center</p>
          <div class="rounded-xl overflow-hidden border border-outline-variant/10 mb-3">
            <iframe src="https://maps.google.com/maps?q=Sukabumi+Prestige+Equestrian+Center+Tenjolaya+Cicurug+Sukabumi&output=embed" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <a href="https://maps.app.goo.gl/5CaeiQx6oKL3pWd79" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-4 py-2.5 rounded-xl hover:bg-primary/20 transition-all">
            <span class="material-symbols-outlined text-sm">map</span>
            Buka Google Maps
          </a>
        </div>

        <div class="flex gap-3 justify-center">
          <router-link to="/" class="bg-surface-container text-on-surface px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-surface-container-high transition-colors">Kembali ke Beranda</router-link>
          <a :href="whatsappUrl" target="_blank"
             class="bg-[#25D366] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1DA851] transition-colors inline-flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Image Preview Lightbox -->
  <div v-if="showImagePreview" class="fixed inset-0 z-[90] overflow-y-auto" @click="showImagePreview = null">
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="relative max-w-4xl w-full" @click.stop>
        <img :src="showImagePreview" alt="Preview" class="w-full h-auto rounded-2xl">
        <button @click="showImagePreview = null"
                class="fixed top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const searchCode = ref('')
const booking = ref(null)
const searching = ref(false)
const searchError = ref('')
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref(null)
const showImagePreview = ref(null)

const whatsappUrl = computed(() => {
  if (!booking.value) return '#'
  const msg = `Halo Spec Camp,\nSaya ingin konfirmasi booking:\nKode: #${booking.value.bookingCode}\nNama: ${booking.value.customerName}\nTotal: Rp ${Number(booking.value.totalPrice).toLocaleString('id-ID')}`
  return `https://wa.me/628119899868?text=${encodeURIComponent(msg)}`
})

const searchBooking = async () => {
  const code = searchCode.value.trim()
  if (!code) return
  searching.value = true
  searchError.value = ''
  booking.value = null
  window.history.replaceState(null, '', '/search-booking?code=' + code)
  try {
    const res = await api.get(`/bookings/code/${code}`)
    booking.value = res.data.data
  } catch (e) {
    searchError.value = e.response?.status === 404 ? 'Booking tidak ditemukan. Periksa kembali kode booking.' : 'Gagal mencari booking.'
  } finally {
    searching.value = false
  }
}

const triggerUpload = () => fileInput.value?.click()

const handleFileSelect = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const formData = new FormData()
    formData.append('paymentProof', file)
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/upload/payment-proof`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/bookings/${booking.value.id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentProof: data.url })
    })
    booking.value.paymentProof = data.url
  } catch (e) {
    uploadError.value = e.message || 'Gagal upload bukti bayar.'
  } finally {
    uploading.value = false
  }
}

const translateStatus = (status) => {
  const map = { pending: 'Menunggu Pembayaran', confirmed: 'Dikonfirmasi', completed: 'Selesai', cancelled: 'Dibatalkan' }
  return map[status] || status
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  if (route.query.code) {
    searchCode.value = route.query.code
    searchBooking()
  }
})
</script>
