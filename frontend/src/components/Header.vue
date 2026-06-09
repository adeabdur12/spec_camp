<template>
  <header class="fixed top-0 w-full z-50 bg-stone-50/70 backdrop-blur-xl shadow-sm flex justify-between items-center px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 md:py-4">
    <router-link to="/" class="flex items-center gap-1.5 xs:gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
      <img src="/logo/logo.svg" alt="SPEC Camping Logo" class="h-8 xs:h-9 sm:h-10 md:h-12 w-auto object-contain drop-shadow-sm" />
      <span class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-primary uppercase tracking-tighter font-headline hidden xs:block">SPEC Camping</span>
    </router-link>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex items-center gap-6">
      <router-link to="/"
         class="text-sm font-medium text-primary hover:text-secondary transition-colors">
        Beranda
      </router-link>
      <router-link to="/about"
         class="text-sm font-medium text-primary hover:text-secondary transition-colors">
        Tentang
      </router-link>
      <a href="#" @click.prevent="scrollToSection('pricing')"
         class="text-sm font-medium text-primary hover:text-secondary transition-colors">
        Paket
      </a>
      <a href="#" @click.prevent="scrollToSection('gallery')"
         class="text-sm font-medium text-primary hover:text-secondary transition-colors">
        Galeri
      </a>
      <router-link to="/booking"
         class="text-sm font-bold text-primary hover:text-secondary transition-colors">
        Booking
      </router-link>
    </nav>

    <div class="hidden lg:flex items-center gap-4">
      <a href="https://www.instagram.com/spec.camping/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-all hover:scale-110 p-2" aria-label="Instagram">
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      <router-link to="/booking"
             class="bg-primary text-on-primary px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider hover:opacity-90 transition-all active:scale-95">
        Booking Sekarang
      </router-link>
    </div>

    <!-- Mobile Menu Button -->
    <button class="lg:hidden p-1.5 xs:p-2 text-primary" @click="toggleMenu" aria-label="Toggle menu">
      <span class="material-symbols-outlined text-xl xs:text-2xl transition-transform duration-300" :class="menuOpen ? 'rotate-90' : ''">
        {{ menuOpen ? 'close' : 'menu' }}
      </span>
    </button>
  </header>

  <!-- Mobile Menu Overlay - Outside Header -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div v-if="menuOpen" class="fixed inset-0 z-40 bg-primary/95 backdrop-blur-xl lg:hidden" @click="closeMenu">
      <div class="flex flex-col items-center justify-center min-h-screen gap-6 xs:gap-8 px-4 xs:px-6 py-16 xs:py-20" @click.stop>
        <nav class="flex flex-col items-center gap-3 xs:gap-4 w-full max-w-xs xs:max-w-sm">
          <router-link to="/"
             class="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 xs:py-4 px-6 xs:px-8 rounded-xl text-lg xs:text-xl font-bold transition-all active:scale-95 backdrop-blur-sm border border-white/10"
             @click="closeMenu">
            Beranda
          </router-link>
          <router-link to="/about"
             class="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 xs:py-4 px-6 xs:px-8 rounded-xl text-lg xs:text-xl font-bold transition-all active:scale-95 backdrop-blur-sm border border-white/10"
             @click="closeMenu">
            Tentang
          </router-link>
          <a href="#" @click.prevent="() => { scrollToSection('pricing'); closeMenu(); }"
             class="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 xs:py-4 px-6 xs:px-8 rounded-xl text-lg xs:text-xl font-bold transition-all active:scale-95 backdrop-blur-sm border border-white/10">
            Paket
          </a>
          <a href="#" @click.prevent="() => { scrollToSection('gallery'); closeMenu(); }"
             class="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 xs:py-4 px-6 xs:px-8 rounded-xl text-lg xs:text-xl font-bold transition-all active:scale-95 backdrop-blur-sm border border-white/10">
            Galeri
          </a>
          <router-link to="/booking"
             class="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 xs:py-4 px-6 xs:px-8 rounded-xl text-lg xs:text-xl font-bold transition-all active:scale-95 backdrop-blur-sm border border-white/10"
             @click="closeMenu">
            Booking
          </router-link>
        </nav>
        <router-link to="/booking"
           class="bg-secondary text-white px-8 xs:px-10 py-3 xs:py-4 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-secondary/80 transition-all active:scale-95 shadow-lg w-full max-w-xs xs:max-w-sm text-center block"
           @click="closeMenu">
          Booking Sekarang
        </router-link>

        <a href="https://www.instagram.com/spec.camp/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-white/80 hover:text-white transition-colors mt-4">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span class="font-bold">Follow @spec.camp</span>
        </a>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}
</script>
