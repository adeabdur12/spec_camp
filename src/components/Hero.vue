<template>
  <section class="relative h-auto min-h-[700px] sm:min-h-[751px] w-full overflow-hidden flex items-end px-3 sm:px-4 md:px-6 lg:px-12 pb-12 sm:pb-16 md:pb-20 lg:pb-32">
    <div class="absolute inset-0 z-0">
      <img alt="Berkemah" class="w-full h-full object-cover" src="/image/spec_camp1.jpeg"/>
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/30"></div>
    </div>
    <div class="relative z-10 max-w-2xl w-full">
      <span class="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-2.5 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4 md:mb-6">Sukabumi Prestige</span>
      <h1 class="font-headline text-[28px] xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.15] tracking-tight mb-4 sm:mb-6 md:mb-8 drop-shadow-lg">
        Tempat Belajar, Alam, dan Petualangan Bertemu
      </h1>
      <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
        <button
          @click="scrollTo('#pricing')"
          class="bg-secondary text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-[11px] xs:text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all group w-full"
        >
          Jelajahi Area
          <span class="material-symbols-outlined text-[14px] xs:text-sm sm:text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        <button
          @click="scrollTo('#gallery')"
          class="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-[11px] xs:text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-white/20 active:scale-95 transition-all w-full"
        >
          <span class="material-symbols-outlined text-[14px] xs:text-sm sm:text-base">play_circle</span>
          Tonton Video
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollTo = (id) => {
  const el = document.querySelector(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
