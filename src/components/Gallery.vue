<template>
  <section id="gallery" class="py-24 px-6 md:px-12 bg-surface-container-low">
    <div class="max-w-7xl mx-auto">
      <div class="mb-16">
        <h2 class="font-headline text-4xl font-black text-primary mb-2">Galeri Foto</h2>
        <p class="text-on-surface-variant">Keindahan alam di Galeri Area kami.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="(item, index) in galleryItems" 
          :key="item.alt" 
          class="aspect-square rounded-2xl overflow-hidden shadow-md relative group cursor-pointer"
          @click="openModal(index)"
        >
          <img v-if="item.type === 'image'" :alt="item.alt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="item.src"/>
          <template v-else-if="item.type === 'video'">
            <video class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="item.src" muted loop playsinline @mouseover="$event.target.play()" @mouseleave="$event.target.pause(); $event.target.currentTime = 0"></video>
            <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <span class="material-symbols-outlined text-white text-5xl drop-shadow-lg">play_circle</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="selectedItem" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12" @click="closeModal">
            <!-- Close Button -->
            <button class="absolute top-6 right-6 text-white hover:text-secondary-fixed transition-colors z-50" @click="closeModal">
              <span class="material-symbols-outlined text-4xl">close</span>
            </button>

            <!-- Navigation Buttons -->
            <button 
              class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-4 rounded-full z-50"
              @click.stop="prevItem"
            >
              <span class="material-symbols-outlined text-4xl">chevron_left</span>
            </button>
            
            <button 
              class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-4 rounded-full z-50"
              @click.stop="nextItem"
            >
              <span class="material-symbols-outlined text-4xl">chevron_right</span>
            </button>
            
            <!-- Content -->
            <div class="max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center" @click.stop>
              <Transition :name="slideDirection" mode="out-in">
                <div :key="selectedItem.src" class="w-full h-full flex flex-col items-center justify-center">
                  <img 
                    v-if="selectedItem.type === 'image'" 
                    :src="selectedItem.src" 
                    :alt="selectedItem.alt" 
                    class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  />
                  <video 
                    v-else-if="selectedItem.type === 'video'" 
                    :src="selectedItem.src" 
                    class="max-w-full max-h-[85vh] rounded-lg shadow-2xl" 
                    controls 
                    autoplay
                  ></video>
                  <p class="text-white mt-6 font-bold text-lg md:text-xl">{{ selectedItem.alt }}</p>
                  <p class="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold">
                    {{ galleryItems.indexOf(selectedItem) + 1 }} / {{ galleryItems.length }}
                  </p>
                </div>
              </Transition>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const selectedIndex = ref(null)
const slideDirection = ref('slide-right') // 'slide-right' or 'slide-left'

const selectedItem = computed(() => {
  return selectedIndex.value !== null ? galleryItems[selectedIndex.value] : null
})

const galleryItems = [
  { alt: 'Pemandangan Area A (Top View)', src: '/image/spec_camp1.jpeg', type: 'image' },
  { alt: 'Pemandangan Area B (Reguler)', src: '/image/spec_camp2.jpeg', type: 'image' },
  { alt: 'Area Tenda Camping', src: '/image/spec_camp3.jpeg', type: 'image' },
  { alt: 'Suasana Alam Pekarangan', src: '/image/spec_camp4.jpeg', type: 'image' },
  { alt: 'Drone View SPEC Camping', src: '/video/spec_camp1.mp4', type: 'video' },
  // { alt: 'Suasana Malam SPEC Camping', src: '/video/spec_camp2.mp4', type: 'video' }
]

const openModal = (index) => {
  selectedIndex.value = index
}

const closeModal = () => {
  selectedIndex.value = null
}

const nextItem = () => {
  slideDirection.value = 'slide-right'
  selectedIndex.value = (selectedIndex.value + 1) % galleryItems.length
}

const prevItem = () => {
  slideDirection.value = 'slide-left'
  selectedIndex.value = (selectedIndex.value - 1 + galleryItems.length) % galleryItems.length
}

const handleKeydown = (e) => {
  if (selectedIndex.value === null) return
  if (e.key === 'ArrowRight') nextItem()
  if (e.key === 'ArrowLeft') prevItem()
  if (e.key === 'Escape') closeModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Right (Next) */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Slide Left (Prev) */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
