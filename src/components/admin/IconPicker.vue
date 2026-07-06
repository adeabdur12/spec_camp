<template>
  <div class="space-y-2">
    <label class="text-xs font-medium text-on-surface-variant">Ikon</label>
    <div class="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-48 overflow-y-auto p-3 bg-surface-container rounded-xl border border-outline-variant/10">
      <button v-for="ico in icons" :key="ico.value" type="button"
              @click="selectIcon(ico.value)"
              :class="['w-full aspect-square rounded-lg flex items-center justify-center text-lg sm:text-base border-2 transition-all',
                       modelValue === ico.value ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container-high text-on-surface-variant hover:border-primary/30 hover:text-primary']"
              :title="ico.label">
        <i :class="'bi ' + ico.value"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const selectIcon = (val) => {
  const newVal = modelValue === val ? '' : val
  emit('update:modelValue', newVal)
}

const icons = [
  // Outdoor & Nature
  { value: 'bi-tree', label: 'Tree' },
  { value: 'bi-flower1', label: 'Flower' },
  { value: 'bi-signpost-2', label: 'Signpost' },
  { value: 'bi-water', label: 'Water' },
  { value: 'bi-sun', label: 'Sun' },
  { value: 'bi-moon-stars', label: 'Moon' },
  { value: 'bi-star', label: 'Star' },
  { value: 'bi-fire', label: 'Fire' },
  { value: 'bi-cloud-sun', label: 'Cloud Sun' },
  { value: 'bi-rainbow', label: 'Rainbow' },
  { value: 'bi-snow', label: 'Snow' },
  { value: 'bi-wind', label: 'Wind' },
  { value: 'bi-tsunami', label: 'Wave' },
  { value: 'bi-droplet', label: 'Droplet' },
  // Camping & Hiking
  { value: 'bi-backpack', label: 'Backpack' },
  { value: 'bi-compass', label: 'Compass' },
  { value: 'bi-map', label: 'Map' },
  { value: 'bi-binoculars', label: 'Binoculars' },
  { value: 'bi-lamp', label: 'Lamp' },
  { value: 'bi-flashlight', label: 'Flashlight' },
  { value: 'bi-person-walking', label: 'Hiking' },
  { value: 'bi-bicycle', label: 'Bicycle' },
  { value: 'bi-signpost', label: 'Trail' },
  // People & Activities
  { value: 'bi-people', label: 'Group' },
  { value: 'bi-person', label: 'Person' },
  { value: 'bi-person-arms-up', label: 'Celebrate' },
  { value: 'bi-emoji-smile', label: 'Happy' },
  { value: 'bi-emoji-laughing', label: 'Fun' },
  { value: 'bi-hand-thumbs-up', label: 'Like' },
  { value: 'bi-heart', label: 'Heart' },
  { value: 'bi-heart-pulse', label: 'Health' },
  { value: 'bi-cup-hot', label: 'Drink' },
  { value: 'bi-cup-straw', label: 'Straw' },
  // Food & Equipment
  { value: 'bi-basket', label: 'Basket' },
  { value: 'bi-basket2', label: 'Basket 2' },
  { value: 'bi-bag', label: 'Bag' },
  { value: 'bi-bag-check', label: 'Bag Check' },
  { value: 'bi-tools', label: 'Tools' },
  { value: 'bi-wrench', label: 'Wrench' },
  { value: 'bi-gear', label: 'Gear' },
  { value: 'bi-box', label: 'Box' },
  { value: 'bi-box-seam', label: 'Package' },
  // Transport
  { value: 'bi-car-front', label: 'Car' },
  { value: 'bi-bus-front', label: 'Bus' },
  { value: 'bi-truck', label: 'Truck' },
  { value: 'bi-fuel-pump', label: 'Fuel' },
  // Media
  { value: 'bi-camera', label: 'Camera' },
  { value: 'bi-camera-video', label: 'Video' },
  { value: 'bi-film', label: 'Film' },
  { value: 'bi-music-note-beamed', label: 'Music' },
  { value: 'bi-music-note', label: 'Note' },
  { value: 'bi-headphones', label: 'Headphone' },
  { value: 'bi-speaker', label: 'Speaker' },
  { value: 'bi-mic', label: 'Mic' },
  // Games & Fun
  { value: 'bi-controller', label: 'Gamepad' },
  { value: 'bi-dice-1', label: 'Dice' },
  { value: 'bi-puzzle', label: 'Puzzle' },
  { value: 'bi-trophy', label: 'Trophy' },
  { value: 'bi-award', label: 'Award' },
  { value: 'bi-star-fill', label: 'Star Fill' },
  { value: 'bi-flag', label: 'Flag' },
  // Safety & Services
  { value: 'bi-shield-check', label: 'Shield' },
  { value: 'bi-shield', label: 'Shield Outline' },
  { value: 'bi-bandaid', label: 'First Aid' },
  { value: 'bi-hospital', label: 'Hospital' },
  { value: 'bi-info-circle', label: 'Info' },
  { value: 'bi-question-circle', label: 'Help' },
  { value: 'bi-telephone', label: 'Phone' },
  { value: 'bi-chat-dots', label: 'Chat' },
  { value: 'bi-envelope', label: 'Mail' },
  { value: 'bi-clock', label: 'Clock' },
  { value: 'bi-calendar', label: 'Calendar' },
  { value: 'bi-calendar-check', label: 'Calendar Check' },
  // Misc
  { value: 'bi-house', label: 'Home' },
  { value: 'bi-building', label: 'Building' },
  { value: 'bi-door-open', label: 'Door' },
  { value: 'bi-window', label: 'Window' },
  { value: 'bi-brightness-high', label: 'Bright' },
  { value: 'bi-moon', label: 'Moon' },
  { value: 'bi-currency-dollar', label: 'Price' },
  { value: 'bi-cash', label: 'Cash' },
  { value: 'bi-credit-card', label: 'Card' },
  { value: 'bi-wallet', label: 'Wallet' },
  { value: 'bi-graph-up', label: 'Growth' },
  { value: 'bi-pie-chart', label: 'Chart' },
  { value: 'bi-clipboard-data', label: 'Report' },
  { value: 'bi-search', label: 'Search' },
  { value: 'bi-pin-map', label: 'Location' },
  { value: 'bi-geo-alt', label: 'Map Pin' },
  { value: 'bi-globe', label: 'Global' }
]
</script>
