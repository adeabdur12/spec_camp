<template>
  <section id="pricing" class="py-24 bg-surface-container-low">
    <div class="px-6 md:px-12 max-w-7xl mx-auto">
      <div class="mb-16">
        <h2 class="font-headline text-4xl font-black text-primary mb-2">Paket Perkemahan & Area</h2>
        <p class="text-on-surface-variant">Pilih paket terbaikmu di tengah dataran tinggi Sukabumi.</p>
      </div>

      <!-- Camping Packages -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div v-for="pkg in packages" :key="pkg.name"
             :class="['rounded-3xl overflow-hidden group shadow-sm border flex flex-col',
                      pkg.featured ? 'border-secondary bg-surface-container-highest shadow-md' : 'border-outline-variant/20 bg-surface-container-highest']">
          <div class="h-48 relative overflow-hidden">
            <img :alt="pkg.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" :src="pkg.image"/>
            <div v-if="pkg.badge" class="absolute top-4 left-4 bg-tertiary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              {{ pkg.badge }}
            </div>
            <div v-if="pkg.featured" class="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              Populer
            </div>
          </div>
          <div class="p-6 flex flex-col flex-1">
            <h3 class="font-headline text-lg font-bold text-primary mb-2">{{ pkg.name }}</h3>
            <p v-if="pkg.description" class="text-xs text-on-surface-variant mb-4 line-clamp-2">{{ pkg.description }}</p>
            <div class="mt-auto">
              <p class="text-2xl font-black text-primary mb-1">Rp {{ pkg.price.toLocaleString('id-ID') }} <span class="text-xs font-normal text-on-surface-variant">/ pax</span></p>
              <p v-if="pkg.minPax > 1" class="text-[10px] text-on-surface-variant/60 mb-4">Min {{ pkg.minPax }} pax</p>
              <p v-else class="text-[10px] text-on-surface-variant/60 mb-4">&nbsp;</p>
            </div>
            <div v-if="pkg.features?.length" class="bg-surface-container-low p-4 rounded-2xl">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">Fasilitas:</p>
              <ul class="space-y-1.5">
                <li v-for="(f, i) in pkg.features" :key="i" class="flex items-start gap-2 text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-[14px] text-primary shrink-0 mt-0.5">check</span>
                  {{ f }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tiket Masuk -->
      <div class="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm mb-16">
        <h3 class="font-headline text-2xl font-bold text-primary mb-2 text-center uppercase tracking-widest">Tiket Masuk</h3>
        <p class="text-center text-on-surface-variant text-sm mb-8">Akses masuk area camping Spec Camp</p>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="t in tickets" :key="t.name" class="bg-surface-container-low p-6 rounded-2xl">
            <h4 class="font-bold text-primary text-lg mb-2">{{ t.name }}</h4>
            <p v-if="t.description" class="text-xs text-on-surface-variant mb-3">{{ t.description }}</p>
            <p class="text-2xl font-black text-primary">Rp {{ t.price.toLocaleString('id-ID') }} <span class="text-xs font-normal text-on-surface-variant">/ orang</span></p>
            <ul v-if="t.features?.length" class="mt-4 space-y-1.5">
              <li v-for="(f, i) in t.features" :key="i" class="flex items-center gap-2 text-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[14px] text-primary">check</span>
                {{ f }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Fasilitas -->
      <div class="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm overflow-x-auto">
        <h3 class="font-headline text-2xl font-bold text-primary mb-8 text-center uppercase tracking-widest">Fasilitas Umum</h3>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-surface-container-low p-6 rounded-2xl">
            <h5 class="font-bold text-secondary uppercase mb-4 border-b border-outline-variant pb-2">Termasuk Semua Paket</h5>
            <ul class="space-y-3 text-sm text-on-surface-variant">
              <li v-for="item in facilityLists.included" :key="item" class="flex items-center gap-2 text-primary">
                <span class="material-symbols-outlined text-lg">check</span>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="bg-primary-container p-6 rounded-2xl text-white">
            <h5 class="font-bold text-secondary-fixed uppercase mb-4 border-b border-white/20 pb-2">Tambahan (Opsional)</h5>
            <ul class="space-y-3 text-sm text-primary-fixed-dim">
              <li v-for="item in facilityLists.extra" :key="item" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">add</span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const formatPrice = (value) => `Rp ${value.toLocaleString('id-ID')}`

const packages = [
  {
    name: 'Saddle Camp',
    description: 'Paket perkemahan untuk 4 orang dengan fasilitas lengkap.',
    price: 350000,
    image: '/image/saddle_camp.jpeg',
    featured: false,
    badge: 'Area A',
    features: ['Tenda Kapasitas 4', 'Lampu Tenda', 'Matras Tenda']
  },
  {
    name: 'Lone Rider Camp',
    description: 'Paket campervan untuk 2 orang, siap jalan.',
    price: 200000,
    image: '/image/lone_rider_camp.jpeg',
    featured: true,
    badge: 'Area B',
    features: ['Tiket masuk 2 orang', '1 unit campervan']
  }
]

const tickets = [
  {
    name: 'Camping (Tiket Masuk)',
    description: 'Tiket masuk area camping Spec Camp.',
    price: 35000,
    features: ['Harga promosi berlaku hingga 30 September 2026']
  },
  {
    name: 'Paket 2 Orang + Tenda',
    description: 'Tiket masuk + tenda untuk 2 orang.',
    price: 280000,
    features: ['Matras tenda', 'Lampu Tenda', 'Tenda Kapasitas 2 Orang']
  }
]

const facilityLists = {
  included: [
    'Toilet & Mushola',
    'Area api unggun',
    'Parkir area dalam',
    'Air mineral',
    'Petugas keamanan 24 jam'
  ],
  extra: [
    'Sewa alat camping (tenda, sleeping bag, dll)',
    'Makanan & minuman (Saung SPEC)',
    'Paket kayu bakar',
    'Jasa pemandu tracking',
    'Team building & games',
    'Berkuda'
  ]
}
</script>
