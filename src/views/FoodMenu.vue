<template>
  <div class="bg-background text-on-background font-body antialiased min-h-screen">
    <Header />

    <!-- Hero -->
    <section class="pt-24 pb-12 bg-primary-container text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-80"></div>
      <div class="relative px-6 md:px-12 max-w-5xl mx-auto text-center">
        <span class="inline-block bg-secondary/30 text-secondary-fixed text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">Saung SPEC</span>
        <h1 class="font-headline text-4xl md:text-5xl font-black mb-4 tracking-tight">Menu Makanan & Minuman</h1>
        <p class="text-on-primary-container/80 text-sm md:text-base max-w-xl mx-auto">Nikmati berbagai pilihan makanan dan minuman langsung di area camping. Pesan langsung ke admin via WhatsApp.</p>
      </div>
    </section>

    <!-- Menu Content -->
    <section class="py-12 md:py-16">
      <div class="px-6 md:px-12 max-w-5xl mx-auto">

        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="items.length === 0" class="text-center py-20">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">restaurant</span>
          <p class="text-on-surface-variant text-sm">Menu belum tersedia saat ini.</p>
        </div>

        <div v-else class="space-y-12">
          <div v-for="cat in categories" :key="cat.value">
            <div v-if="getByCategory(cat.value).length > 0">
              <div class="flex items-center gap-3 mb-6">
                <span class="text-2xl">{{ cat.emoji }}</span>
                <h2 class="font-headline text-2xl font-bold text-primary">{{ cat.label }}</h2>
                <div class="flex-1 h-px bg-outline-variant/20 ml-2"></div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="item in getByCategory(cat.value)" :key="item.id"
                     class="bg-surface-container-lowest rounded-2xl p-5 flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-bold text-on-surface leading-tight">{{ item.name }}</h3>
                    <p v-if="item.description" class="text-xs text-on-surface-variant mt-1 line-clamp-2">{{ item.description }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-sm font-bold text-primary whitespace-nowrap">{{ formatCurrency(item.price) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-16 bg-primary-container rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 class="font-headline text-xl md:text-2xl font-bold mb-3">Pesan Sekarang</h3>
          <p class="text-on-primary-container/80 text-sm mb-6 max-w-md mx-auto">Langsung chat admin untuk pemesanan makanan & minuman di Saung SPEC.</p>
          <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-secondary/80 transition-all active:scale-95 shadow-lg">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat Admin WhatsApp
          </a>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { saungSpecMenuService } from '../services/saungSpecMenuService'

const loading = ref(true)
const items = ref([])

const categories = [
  { value: 'makanan', label: 'Makanan', emoji: '🍽️' },
  { value: 'cemilan', label: 'Cemilan', emoji: '🍪' },
  { value: 'rebusan', label: 'Rebusan', emoji: '🫕' },
  { value: 'minuman', label: 'Minuman', emoji: '☕' }
]

const getByCategory = (cat) => items.value.filter(i => i.category === cat)

const whatsappUrl = computed(() => {
  const phone = '6281282998685'
  const text = encodeURIComponent('Halo Kak, saya mau pesan makanan di Saung SPEC.')
  return `https://wa.me/${phone}?text=${text}`
})

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await saungSpecMenuService.getPublic()
  } catch (err) {
    console.error('Gagal mengambil menu:', err)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}

onMounted(fetchItems)
</script>
