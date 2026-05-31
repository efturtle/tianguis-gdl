<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {{ tianguis.name }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span
            class="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded text-xs font-medium mr-2 border border-transparent dark:border-blue-800/50">
            {{ getDayLabel(tianguis.day) }}
          </span>
          {{ tianguis.municipality }}
        </p>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ formatLocation(tianguis.location) }}
        </p>
      </div>
      <div v-if="tianguis.distance" class="ml-4 text-right shrink-0">
        <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
          {{ formatDistance(tianguis.distance) }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">distancia</div>
      </div>
    </div>

    <a :href="`/mapa?lat=${tianguis.lat}&lng=${tianguis.lng}`" @click="handleMapClick"
      class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      Ver en mapa
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Tianguis, DayOfWeek } from '../../types/tianguis';
import { formatDistance as formatDistanceUtil } from '../../utils/geolocation';

interface TianguisWithDistance extends Tianguis {
  distance?: number;
}

const props = defineProps<{
  tianguis: TianguisWithDistance;
}>();

// NEW: Check if screen is Desktop (Tailwind 'md' breakpoint = 768px)
const isDesktop = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768;
});

// NEW: Smart click handler
function handleMapClick(event: MouseEvent) {
  if (isDesktop.value) {
    // On Desktop: Prevent navigation and tell Map.vue to pan to these coordinates
    event.preventDefault();
    debugger;
    const focusEvent = new CustomEvent('tianguis:focus-map', {
      detail: {
        lat: props.tianguis.lat,
        lng: props.tianguis.lng,
        id: props.tianguis.name
      }
    });
    window.dispatchEvent(focusEvent);
  }
  // On Mobile: Do nothing, let the <a> tag naturally navigate to the mobile map page
}

function formatLocation(location: Tianguis['location']): string {
  if (location.type === 'streets') {
    return `${location.street1} / ${location.street2}`;
  }
  return location.direccion;
}

function getDayLabel(day: DayOfWeek): string {
  const dayMap = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo',
  };
  return dayMap[day];
}

function formatDistance(distance: number | undefined): string {
  if (distance === undefined) return '';
  return formatDistanceUtil(distance);
}
</script>
