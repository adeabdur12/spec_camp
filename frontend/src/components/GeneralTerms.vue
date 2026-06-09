<template>
  <section class="py-24 px-6 md:px-12 bg-surface">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-headline text-3xl font-bold text-primary mb-12 text-center">Ketentuan Umum</h2>
      <div class="bg-surface-container rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/30">
        <table class="w-full">
          <thead class="bg-secondary text-white">
            <tr>
              <th class="py-4 px-6 text-left font-bold uppercase tracking-widest text-sm">Ketentuan</th>
              <th class="py-4 px-6 text-left font-bold uppercase tracking-widest text-sm">Keterangan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            <tr v-for="term in terms" :key="term.key">
              <td class="py-4 px-6 font-bold text-primary">{{ term.key }}</td>
              <td :class="['py-4 px-6 text-on-surface-variant', term.class || '']">{{ term.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
const terms = [
  { key: 'Minimal Peserta', value: '25 pax / orang' },
  { key: 'Harga', value: 'Berlaku per pax / orang' },
  { key: 'Check-in', value: '14.00 WIB' },
  { key: 'Check-out', value: '11.00 WIB' },
  { key: 'Konsumsi', value: 'Disediakan sesuai paket' },
  { key: 'Aktivitas Tambahan', value: 'Bisa request (tracking, games, dan edukasi)' },
  { key: 'Anak usia <5 tahun', value: 'Gratis (tanpa fasilitas & konsumsi)', class: 'text-sm italic' }
]
</script>
