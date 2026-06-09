<template>
  <section class="py-24 px-6 md:px-12 bg-primary">
    <div class="max-w-7xl mx-auto">
      <div class="mb-16 text-center">
        <h2 class="font-headline text-4xl font-black text-white mb-4">Paket Komunitas</h2>
        <p class="text-primary-fixed-dim max-w-2xl mx-auto">Minimal 25 pax / orang. Rasakan petualangan bersama komunitas Anda.</p>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="text-center text-primary-fixed-dim py-12">
        <p>Gagal memuat paket. Silakan coba lagi.</p>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8 items-stretch">
        <div v-for="pkg in packages" :key="pkg.id" :class="['p-8 rounded-3xl flex flex-col h-full border shadow-lg relative', pkg.isFeatured ? 'bg-primary-container border-2 border-secondary scale-105 shadow-2xl' : 'bg-primary-container border-white/10']">
          <div v-if="pkg.isFeatured" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Populer</div>
          <h4 class="font-headline text-xl font-bold text-white mb-2">{{ pkg.name }}</h4>
          <p class="text-3xl font-black text-secondary-fixed mb-1">Rp {{ Number(pkg.pricePerPax).toLocaleString('id-ID') }} <span class="text-sm font-normal text-white/60">/ pax</span></p>
          <p class="text-xs text-white/40 mb-6 italic">(Min {{ pkg.minPax || 25 }} pax)</p>
          <p v-if="pkg.description" class="text-sm text-primary-fixed-dim mb-4">{{ pkg.description }}</p>
          <div class="flex-grow">
            <div :class="['rounded-xl p-4 mb-4', pkg.isFeatured ? 'bg-white/10' : 'bg-white/5']">
              <p class="text-xs font-bold text-secondary-fixed uppercase mb-3">Fasilitas:</p>
              <p v-if="pkg.description" class="text-sm text-primary-fixed-dim">{{ pkg.description }}</p>
              <p v-else class="text-sm text-primary-fixed-dim/60 italic">Fasilitas termasuk dalam paket.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { packageService } from '../services/packageService'

const packages = ref([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const data = await packageService.getByCategory('community')
    packages.value = data
  } catch (err) {
    console.error('Failed to load community packages:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
