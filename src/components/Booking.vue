<template>
  <section class="py-16 xs:py-20 sm:py-24 px-3 xs:px-4 sm:px-6" id="booking">
    <div class="max-w-5xl mx-auto bg-surface-container rounded-[2rem] xs:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-xl">
      <div class="md:w-1/2 relative min-h-[300px] xs:min-h-[350px] sm:min-h-[400px]">
        <img alt="Kandang" class="w-full h-full object-cover" data-alt="Interior of a luxury wooden horse stable..." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9O0TubAx4dcPjmNiEyvF-VHmpHJNaFrEt-9P5c1xUsWpuv3rLCPdmCFenzggGYR86_nGM_olA4OXhTqkYY5e9xmVh-8y0yW7q-OI3oLx_1xdczu-iBqjmeLMa1C87Hxfuim_icX6jX-mtlJaSQNyNm6LX84wn33S6ceFvyqv21vp3MwR68HNRrjvpB6J1yTXkJtlkExkgMmEGi_Df-9cEk8Egh-4m623wVW3VrVmxvRCoOu5cJTIIf5caUi93n0STLFKtvti6vWuw"/>
        <div class="absolute inset-0 bg-primary/20"></div>
      </div>
      <div class="md:w-1/2 p-6 xs:p-8 sm:p-10 md:p-16 flex flex-col justify-center">
        <h2 class="font-headline text-2xl xs:text-3xl font-black text-primary mb-3 xs:mb-4">Booking Pengalaman Anda</h2>
        <p class="text-on-surface-variant text-xs xs:text-sm mb-8 xs:mb-10">Tempat terbatas untuk akhir pekan. Amankan peristirahatan pegunungan Anda hari ini.</p>

        <router-link to="/booking"
                     class="w-full bg-primary text-white py-3 xs:py-3 sm:py-4 rounded-full font-bold text-[11px] xs:text-xs sm:text-base uppercase tracking-widest shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 mb-4">
          <span class="material-symbols-outlined text-lg">calendar_month</span>
          Pesan Online
        </router-link>

        <div class="relative flex items-center gap-3 mb-4">
          <span class="h-px flex-1 bg-outline-variant/20"></span>
          <span class="text-[10px] text-on-surface-variant font-medium">atau</span>
          <span class="h-px flex-1 bg-outline-variant/20"></span>
        </div>

        <button @click="handleBooking"
                class="w-full bg-[#25D366] text-white py-2.5 xs:py-3 sm:py-4 rounded-full font-bold text-[11px] xs:text-xs sm:text-base uppercase tracking-widest shadow-lg hover:bg-[#1DA851] transition-all active:scale-95 flex justify-center items-center gap-1.5 xs:gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
          Tanya via WhatsApp
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const handleBooking = () => {
  const phoneNumber = '628119899868'
  const message = `Halo SPEC Camping,\nSaya ingin bertanya tentang booking dan ketersediaan tempat.`
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
}
</script>
