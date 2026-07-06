<template>
  <section class="py-24 px-6 md:px-12 bg-surface">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="font-headline text-3xl md:text-5xl font-bold text-primary mb-8">SPEC Camping Experience</h2>
      <p class="text-lg md:text-xl text-on-surface-variant leading-relaxed font-medium">
        SPEC (Sukabumi Prestige Equestrian Center) adalah kawasan wisata edukasi dan camping ground yang berlokasi di kaki Gunung Salak. Menggabungkan pengalaman alam, edukasi, dan petualangan dalam satu destinasi.
      </p>
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="feature in features" :key="feature.label" class="flex flex-col items-center">
          <span class="material-symbols-outlined text-4xl text-secondary mb-2" :data-icon="feature.icon">{{ feature.icon }}</span>
          <span class="font-bold text-primary">{{ feature.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  { icon: 'filter_hdr', label: 'Pemandangan 360°' },
  { icon: 'air', label: 'Udara Segar' },
  { icon: 'pet_supplies', label: 'Kunjungan Kandang' },
  { icon: 'local_fire_department', label: 'Area Api Unggun' }
]
</script>
