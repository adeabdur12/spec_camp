<template>
  <div class="bg-surface min-h-screen font-body antialiased">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div class="px-5 py-4 flex items-center justify-between max-w-lg mx-auto">
        <div class="flex items-center gap-3">
          <img src="/logo/logo.svg" alt="SPEC CAMP Logo" class="h-10 w-auto" />
          <div>
            <span class="font-headline text-xl font-black text-primary tracking-tight">SPEC CAMP</span>
            <p class="text-[11px] text-on-surface-variant uppercase tracking-wider leading-tight">Sukabumi Prestige Equestrian Center</p>
          </div>
        </div>
        <span class="font-headline text-sm font-bold text-secondary">Saung SPEC</span>
      </div>
    </header>

    <!-- Category Tabs -->
    <div class="sticky top-[60px] z-40 bg-surface-container-low/80 backdrop-blur-lg border-b border-outline-variant/10">
      <div class="px-5 pt-2.5 max-w-lg mx-auto">
        <div class="relative mb-2.5">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
          <input v-model="searchQuery" type="text" placeholder="Cari menu..."
                 class="w-full bg-surface-container pl-9 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-on-surface-variant/40" />
          <button v-if="searchQuery" @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div class="flex gap-2 pb-2.5 overflow-x-auto no-scrollbar">
          <button v-for="cat in categories" :key="cat.value"
                  @click="activeCategory = cat.value"
                  :class="['px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all',
                           activeCategory === cat.value
                             ? 'bg-primary text-on-primary shadow-sm shadow-primary/20'
                             : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high']">
            {{ cat.emoji }} {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-20 px-6">
      <span class="text-5xl mb-4 block">🍽️</span>
      <p class="text-on-surface-variant text-sm">Menu belum tersedia.</p>
    </div>

    <!-- Menu List -->
    <main v-else class="pb-28 max-w-lg mx-auto">
      <div class="px-5 pt-4 pb-2">
        <h2 class="font-headline text-lg font-bold text-primary">{{ activeCatLabel }}</h2>
        <p class="text-[11px] text-on-surface-variant">{{ filteredItems.length }} item tersedia</p>
      </div>

      <div class="px-5 space-y-2.5">
        <div v-for="item in filteredItems" :key="item.id"
             class="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div class="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-2xl shrink-0">
            {{ getCatEmoji(item.category) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-on-surface leading-tight">{{ item.name }}</h3>
            <p v-if="item.description" class="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">{{ item.description }}</p>
            <p class="text-sm font-bold text-primary mt-1">{{ formatCurrency(item.price) }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <template v-if="getQty(item.id) > 0">
              <button @click="removeItem(item)"
                      class="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center active:scale-90 transition-transform">
                <span class="material-symbols-outlined text-lg">remove</span>
              </button>
              <span class="w-6 text-center text-sm font-bold text-on-surface">{{ getQty(item.id) }}</span>
            </template>
            <button @click="addItem(item)"
                    class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform shadow-sm shadow-primary/20">
              <span class="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Sticky Cart Bar -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-full" enter-to-class="translate-y-0"
                leave-active-class="transition ease-in duration-200" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
      <div v-if="cartCount > 0" class="fixed bottom-0 inset-x-0 z-50 p-4 pb-6">
        <div class="max-w-lg mx-auto bg-primary rounded-2xl p-4 shadow-xl shadow-primary/30 flex items-center gap-4">
          <div class="flex-1">
            <p class="text-on-primary/80 text-[11px] font-medium">{{ cartCount }} item dipilih</p>
            <p class="text-white font-bold text-lg">{{ formatCurrency(cartTotal) }}</p>
          </div>
          <button @click="orderViaWhatsApp"
                  class="bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-secondary/80 transition-all active:scale-95 flex items-center gap-2 shadow-lg">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Pesan
          </button>
        </div>
      </div>
    </transition>

    <!-- Note banner -->
    <div v-if="!loading && items.length > 0 && cartCount === 0"
         class="fixed bottom-0 inset-x-0 z-40 px-4 pb-5">
      <div class="max-w-lg mx-auto bg-surface-container-highest/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
        <span class="material-symbols-outlined text-sm text-secondary">info</span>
        <p class="text-[11px] text-on-surface-variant">Tidak boleh bawa makanan dari luar.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { saungSpecMenuService } from '../services/saungSpecMenuService'

const loading = ref(true)
const items = ref([])
const cart = ref({})

const categories = [
  { value: 'all', label: 'Semua', emoji: '📋' },
  { value: 'makanan', label: 'Makanan', emoji: '🍽️' },
  { value: 'cemilan', label: 'Cemilan', emoji: '🍪' },
  { value: 'rebusan', label: 'Rebusan', emoji: '🫕' },
  { value: 'minuman', label: 'Minuman', emoji: '☕' }
]

const activeCategory = ref('all')
const searchQuery = ref('')

const activeCatLabel = computed(() => {
  const cat = categories.find(c => c.value === activeCategory.value)
  return cat ? cat.label : 'Semua'
})

const filteredItems = computed(() => {
  let result = items.value
  if (activeCategory.value !== 'all') {
    result = result.filter(i => i.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(i => i.name.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q)))
  }
  return result
})

const cartCount = computed(() => Object.values(cart.value).reduce((sum, q) => sum + q, 0))

const cartTotal = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + (cart.value[item.id] || 0) * item.price
  }, 0)
})

const getQty = (id) => cart.value[id] || 0

const addItem = (item) => {
  cart.value[item.id] = (cart.value[item.id] || 0) + 1
}

const removeItem = (item) => {
  if (cart.value[item.id] > 1) {
    cart.value[item.id]--
  } else {
    delete cart.value[item.id]
  }
}

const getCatEmoji = (cat) => {
  const emojis = { makanan: '🍽️', cemilan: '🍪', rebusan: '🫕', minuman: '☕' }
  return emojis[cat] || '🍽️'
}

const orderViaWhatsApp = () => {
  const phone = '6281282998685'
  let lines = ['Halo Kak, saya mau pesan:', '']
  for (const item of items.value) {
    const qty = cart.value[item.id]
    if (qty > 0) {
      lines.push(`• ${item.name} x${qty} = ${formatCurrency(item.price * qty)}`)
    }
  }
  lines.push('')
  lines.push(`Total: ${formatCurrency(cartTotal.value)}`)
  lines.push('')
  lines.push('(Ketik nama & lokasi untuk konfirmasi)')
  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}

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

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
