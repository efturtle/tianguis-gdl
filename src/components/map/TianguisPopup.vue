<template>
  <div class="font-sans max-w-70 dark:bg-gray-900">
    <h3 class="text-base font-bold text-gray-800 dark:text-gray-100 m-0 mb-3 pb-2 border-b-2 border-blue-500 dark:border-blue-400">
      {{ tianguis.name }}
    </h3>
    
    <div class="text-[13px]">
      <p class="my-2 mb-3 text-gray-600 dark:text-gray-400 leading-relaxed">
        <strong class="text-gray-800 dark:text-gray-300 inline-block mb-0.5">📍 Ubicación:</strong><br />
        {{ formatLocation(tianguis) }}
      </p>
      
      <p class="my-2 text-gray-600 dark:text-gray-400 leading-relaxed">
        <strong class="text-gray-800 dark:text-gray-300 inline-block mb-0.5">📅 Día:</strong> 
        <span class="inline-block bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-semibold text-xs ml-1">
          {{ capitalizeDay(tianguis.day) }}
        </span>
      </p>
      
      <p class="my-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        <strong class="text-gray-800 dark:text-gray-300 inline-block mb-0.5 text-[13px]">🏙️ Municipio:</strong> 
        {{ capitalizeMunicipality(tianguis.municipality) }}
      </p>

      <a 
        :href="getGoogleMapsUrl(tianguis)" 
        target="_blank" 
        rel="noopener noreferrer"
        class="mt-4 block w-full text-center bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 font-semibold py-2 px-3 rounded-md transition-colors border border-blue-200 dark:border-gray-600 text-[13px]"
      >
        🗺️ Ver en Google Maps
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DayOfWeek } from '../../types/tianguis';

interface Props {
  tianguis: any;
}

const props = defineProps<Props>();

function formatLocation(tianguis: any) {
  if (tianguis.location?.type === 'address') {
    return tianguis.location.direccion;
  } else if (tianguis.location?.type === 'streets') {
    const loc = tianguis.location;
    return `${loc.street1} / ${loc.street2}`;
  }
  // Fallback for raw data
  if (tianguis.direccion) return tianguis.direccion;
  if (tianguis.street1) return `${tianguis.street1} / ${tianguis.street2 || ''}`;
  return 'Ubicación no disponible';
}

function capitalizeDay(day: DayOfWeek): string {
  const days = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo',
  };
  return days[day] || day;
}

function capitalizeMunicipality(municipality: string): string {
  if (!municipality) return '';
  return municipality.charAt(0).toUpperCase() + municipality.slice(1);
}

// Generates a Google Maps search URL based on the location and municipality
function getGoogleMapsUrl(tianguis: any): string {  
  const url = `https://www.google.com/maps/search/?api=1&query=${tianguis.lat},${tianguis.lng}`;
  return url;
}
</script>