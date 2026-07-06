<template>
  <section id="pricing" class="py-24 bg-surface-container-low">
    <div class="px-6 md:px-12 max-w-7xl mx-auto">
      <div class="mb-16">
        <h2 class="font-headline text-4xl font-black text-primary mb-2">Harga Paket Perkemahan & Area</h2>
        <p class="text-on-surface-variant">Pilih spot terbaikmu di tengah dataran tinggi Sukabumi.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-12">
        <div v-for="area in areas" :key="area.title" class="bg-surface-container-highest rounded-3xl overflow-hidden group shadow-sm border border-outline-variant/20">
          <div class="h-64 relative overflow-hidden">
            <img :alt="area.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" :src="area.image"/>
            <div :class="['absolute top-6 left-6 px-4 py-1 rounded-full text-xs font-bold uppercase', area.badgeClass]">
              {{ area.badge }}
            </div>
          </div>
          <div class="p-8">
            <h3 class="font-headline text-2xl font-bold text-primary mb-6">{{ area.title }}</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="border-b border-outline-variant/30">
                  <tr class="text-left text-secondary font-bold uppercase tracking-wider">
                    <th class="pb-3">Hari</th>
                    <th class="pb-3 text-center">Ekonomis</th>
                    <th class="pb-3 text-right">Full</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/10">
                  <tr v-for="price in area.prices" :key="price.day">
                    <td class="py-4 font-medium text-on-surface">{{ price.day }}</td>
                    <td class="py-4 text-center font-bold text-primary">{{ formatPrice(price.ekonomi) }}</td>
                    <td class="py-4 text-right font-bold text-primary">{{ formatPrice(price.full) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Facility Lists -->
      <div class="mt-16 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm overflow-x-auto">
        <h4 class="font-headline text-2xl font-bold text-primary mb-8 text-center uppercase tracking-widest">Fasilitas Area A, B & C</h4>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-surface-container-low p-6 rounded-2xl">
            <h5 class="font-bold text-secondary uppercase mb-4 border-b border-outline-variant pb-2">Paket Ekonomis</h5>
            <ul class="space-y-3 text-sm text-on-surface-variant">
              <li v-for="item in facilityLists.ekonomis" :key="item.text" :class="['flex items-center gap-2', item.class || '']">
                <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
                {{ item.text }}
              </li>
            </ul>
          </div>
          <div class="bg-primary-container p-6 rounded-2xl text-white">
            <h5 class="font-bold text-secondary-fixed uppercase mb-4 border-b border-white/20 pb-2">Paket Full</h5>
            <ul class="space-y-3 text-sm text-primary-fixed-dim">
              <li v-for="item in facilityLists.full" :key="item.text" :class="['flex items-center gap-2', item.class || '']">
                <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
                {{ item.text }}
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

const areas = [
  {
    title: 'Area A (Top View)',
    badge: 'View Utama',
    badgeClass: 'bg-tertiary text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByi39NW8bA4KGVMjTY_7OxauQyemH3TTz0gIeoHBUpVoN2-rg0T6CsSBdY7gr85eHbBdOixpwyZ6sxLtWdkfGuWMYcyuSm8YDOF-HNIurWMWezybYHGYeot1qHUPocPQ8TFNS4qjkTA63E2uVH9oZbUeOcDmxDo7XxnLNAW3_8ypQZtFzd8bo3Aa_0aOemdT2kjatDdyG5qt5iQFFAG2tQVthXDiAndPix9JsTb8k_vJnEg1vIhLtSHf1J3s5uHcBUUaNLIn7qXdlY',
    prices: [
      { day: 'Weekday', ekonomi: 350000, full: 450000 },
      { day: 'Weekend', ekonomi: 450000, full: 600000 }
    ]
  },
  {
    title: 'Area B & C (Reguler)',
    badge: 'Reguler',
    badgeClass: 'bg-primary text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5DgB5LUFdpWZ9s5izPcpkK9scsF9lYDqOeRHSmPo7Kr0IZ8lRnKp6Z7iyQ2PIPmQ4L8vKXS9rWPIULADEIyRbuZdD1KrkA8Xdap4ieUhZPUh76j8-9zBLXp_YgDXGXl9okBzyUSLYLkNVOqCuBDmi6hSyfav-t-ZtLL3htzp6bfQltYoQ5BiQUR2xdgTtAD4-2_m2ELIYWYnQWaNXzamOT7W0tPer3LfpgWBDzyBk4JWrAcdD-zTuwOTQwiUk71cJs4aCh68fykXN',
    prices: [
      { day: 'Weekday', ekonomi: 300000, full: 400000 },
      { day: 'Weekend', ekonomi: 400000, full: 500000 }
    ]
  }
]

const facilityLists = {
  ekonomis: [
    { text: 'Tiket masuk area camping', icon: 'check', class: 'text-primary' },
    { text: 'Sewa lahan', icon: 'check', class: 'text-primary' },
    { text: 'Tenda (2-4 orang)', icon: 'check', class: 'text-primary' },
    { text: 'Toilet & Mushola', icon: 'check', class: 'text-primary' },
    { text: 'Area api unggun', icon: 'check', class: 'text-primary' },
    { text: 'Belum termasuk makan', icon: 'close', class: 'text-error' }
  ],
  full: [
    { text: 'Tiket masuk area camping', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Sewa lahan', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Tenda (2-4 orang)', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Toilet & Mushola', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Area api unggun', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Alat tidur (sleeping bag, matras, bantal)', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Bonus aktivitas (tracking & games)', icon: 'check', class: 'text-secondary-fixed' },
    { text: 'Belum termasuk makan', icon: 'close', class: 'text-error-container' }
  ]
}
</script>
