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
import type { Tianguis, DayOfWeek } from '../../types/tianguis';
import { formatDistance as formatDistance } from '../../utils/geolocation';

interface TianguisWithDistance extends Tianguis {
  distance?: number;
}

const props = defineProps<{
  tianguis: TianguisWithDistance;
}>();

function getDayLabel(day: DayOfWeek) {
  const days: Record<DayOfWeek, string> = {
    lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
    jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
  };
  return days[day] || day;
}

function formatLocation(location: any) {
  if (location.type === 'address') return location.direccion;
  if (location.type === 'streets') return `${location.street1} / ${location.street2}`;
  return 'Ubicación no disponible';
}

function handleMapClick(event: MouseEvent) {
  // Measure the screen width RIGHT NOW, not when the page loaded
  const isCurrentlyDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  if (isCurrentlyDesktop) {
    // We are actually on Desktop: prevent URL navigation and talk to the side-by-side map
    event.preventDefault();

    const focusEvent = new CustomEvent('tianguis:focus-map', {
      detail: {
        lat: props.tianguis.lat,
        lng: props.tianguis.lng,
        id: props.tianguis.name
      }
    });
    window.dispatchEvent(focusEvent);
  }
}
</script>
