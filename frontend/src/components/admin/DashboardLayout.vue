<script setup>
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import MobileNav from './MobileNav.vue'
import { ref } from 'vue'

defineProps({
  title: String,
  subtitle: String
})

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-surface font-sans text-on-surface">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="lg:ml-72 min-h-screen flex flex-col pb-20 lg:pb-0">
      <!-- Topbar -->
      <Topbar :title="title" :subtitle="subtitle" @toggle-sidebar="isSidebarOpen = true" />

      <!-- Content -->
      <main class="flex-1 p-4 md:p-6 lg:p-10">
        <slot></slot>
      </main>
    </div>

    <!-- Mobile Navigation -->
    <MobileNav @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
  </div>
</template>
