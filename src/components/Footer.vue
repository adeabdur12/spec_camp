<template>
  <footer class="w-full rounded-t-3xl mt-20 bg-primary text-stone-50 font-body text-sm tracking-wide">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 xs:gap-8 md:gap-12 px-4 xs:px-6 sm:px-8 md:px-12 py-10 xs:py-12 md:py-16 w-full max-w-7xl mx-auto">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 md:mb-6">
          <div class="bg-white p-1.5 xs:p-2 rounded-xl inline-block shadow-md">
            <img src="/logo/logo.svg" alt="SPEC Camping Logo" class="h-7 xs:h-8 sm:h-10 w-auto object-contain" />
          </div>
          <span class="text-base xs:text-lg sm:text-xl font-bold text-stone-50 font-headline tracking-widest uppercase">SPEC CAMPING</span>
        </div>
        <p class="text-stone-300/80 leading-relaxed mb-3 xs:mb-4 md:mb-6 text-xs xs:text-sm md:text-base">
          Destinasi berkuda dan berkemah premium di Sukabumi. Rasakan perpaduan sempurna antara kenyamanan kelas atas dan petualangan alam.
        </p>
        <div class="flex gap-2 xs:gap-3 md:gap-4">
          <a class="text-stone-300/80 hover:text-secondary-fixed transition-all hover:scale-110" href="https://www.instagram.com/spec.camping/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg class="w-5 h-5 xs:w-6 xs:h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
      <div>
        <h6 class="font-bold text-secondary-fixed mb-3 xs:mb-4 md:mb-6 uppercase tracking-widest text-[10px] xs:text-xs">Jelajahi</h6>
        <ul class="space-y-2 xs:space-y-3 md:space-y-4">
          <li>
            <router-link to="/" 
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Beranda
            </router-link>
          </li>
          <li>
            <router-link to="/about" 
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Tentang Kami
            </router-link>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToSection('pricing')"
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Paket & Harga
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToSection('gallery')"
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Galeri
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h6 class="font-bold text-secondary-fixed mb-3 xs:mb-4 md:mb-6 uppercase tracking-widest text-[10px] xs:text-xs">Informasi</h6>
        <ul class="space-y-2 xs:space-y-3 md:space-y-4">
          <li>
            <router-link to="/terms" 
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Syarat & Ketentuan
            </router-link>
          </li>
          <li>
            <router-link to="/privacy" 
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Kebijakan Privasi
            </router-link>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToSection('booking')"
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Reservasi
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollToSection('contact')"
               class="text-stone-300/80 hover:text-stone-50 transition-all hover:translate-x-1 inline-block text-xs xs:text-sm">
              Kontak
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/5 py-4 xs:py-6 md:py-8 text-center text-stone-400 text-[10px] xs:text-xs sm:text-sm px-4">
      © {{ new Date().getFullYear() }} SPEC Camping Sukabumi. Hak Cipta Dilindungi.
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const scrollToSection = (sectionId) => {
  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  } else {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>
