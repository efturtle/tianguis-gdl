<template>
  <div class="mobile-map-container bg-gray-50 dark:bg-gray-900">
    <div class="map-header absolute top-0 inset-x-0 z-10 flex justify-between items-center py-3 px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <button @click="goBack" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 active:scale-[0.98] active:bg-gray-50 dark:active:bg-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Volver</span>
      </button>

      <div class="flex gap-2">
        <DarkModeToggle />
        <button 
          @click="centerOnUser" 
          class="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-blue-500 dark:text-blue-400 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:text-gray-400 dark:disabled:text-gray-500 active:not-disabled:scale-95 active:not-disabled:bg-blue-50 dark:active:not-disabled:bg-gray-700" 
          :disabled="!userLocation"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="map-wrapper" ref="mapContainer">
      <mgl-map
        ref="mapInstance"
        :map-style="style"
        :center="mapCenter"
        :zoom="mapZoom"
        height="100%"
        @map:load="onMapLoad"
      >
        <mgl-navigation-control position="top-right" />
        <mgl-geolocate-control position="top-right" @geolocate="onGeolocate" />
        <mgl-marker v-if="selectedTianguis" :coordinates="[selectedTianguis.lng, selectedTianguis.lat]">
            <mgl-popup :offset="25">
              <TianguisPopup :tianguis="selectedTianguis" />
            </mgl-popup>
        </mgl-marker>
      </mgl-map>
    </div>

    <div
      class="bottom-sheet bg-white dark:bg-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] rounded-t-3xl"
      :class="{ 'expanded': isSheetExpanded, 'visible': selectedTianguis }"
      ref="bottomSheet"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-3 mb-4"></div>

      <div v-if="selectedTianguis" class="sheet-content px-6 pb-6 overflow-y-auto max-h-[calc(75vh-3rem)]">
        <div class="flex items-center gap-4 cursor-pointer pb-4" @click="toggleSheet">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              {{ selectedTianguis.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span class="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded text-xs font-semibold mr-2">
                {{ getDayLabel(selectedTianguis.day) }}
              </span>
              {{ selectedTianguis.municipality }}
            </p>
          </div>
          <svg
            class="w-6 h-6 text-gray-400 dark:text-gray-500 transition-transform"
            :class="{ 'rotate-180': isSheetExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div v-if="isSheetExpanded" class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="mb-5">
            <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ubicación
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{ formatLocation(selectedTianguis) }}</p>
          </div>

          <div class="mb-5">
            <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Día de la semana
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{ getDayLabel(selectedTianguis.day) }}</p>
          </div>

          <div class="mb-5">
            <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Municipio
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{ capitalizeMunicipality(selectedTianguis.municipality) }}</p>
          </div>

          <div v-if="selectedTianguis.distance" class="mb-5">
            <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Distancia
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{ formatDistance(selectedTianguis.distance) }}</p>
          </div>

          <div class="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button @click="openInGoogleMaps" class="w-full flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 text-white rounded-xl font-medium text-[15px] transition-all active:scale-[0.98] active:bg-blue-700 dark:bg-blue-600 dark:active:bg-blue-700 border-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Abrir en Google Maps
            </button>

            <button @click="shareLocation" class="w-full flex items-center justify-center gap-2 py-3 px-5 bg-white dark:bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-xl font-medium text-[15px] transition-all active:scale-[0.98] active:bg-blue-50 dark:active:bg-blue-900/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center">
        <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
          Toca un marcador en el mapa para ver más información
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglMarker,
  MglPopup,
} from '@indoorequal/vue-maplibre-gl';
import { formatDistance as formatDist } from '../utils/geolocation';
import type { DayOfWeek } from '../types/tianguis';
import TianguisPopup from './TianguisPopup.vue';
import DarkModeToggle from './DarkModeToggle.vue';

interface Props {
  tianguis: any[];
}

const props = defineProps<Props>();

const urlParams = new URLSearchParams(window.location.search);
const focusLat = urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : null;
const focusLng = urlParams.get('lng') ? parseFloat(urlParams.get('lng')!) : null;
const focusName = urlParams.get('name') || null;

const mapInstance = ref<any>(null);
const bottomSheet = ref<HTMLElement | null>(null);
const selectedTianguis = ref<any | null>(null);
const isSheetExpanded = ref(false);
const userLocation = ref<{ lat: number; lng: number } | null>(null);

// Reactive map style that switches based on dark mode
const isDarkMode = ref(document.documentElement.classList.contains('dark'));
const style = ref(
  isDarkMode.value
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
);

const mapCenter = ref<[number, number]>([-103.3496, 20.6597]);
const mapZoom = ref(12);

let touchStartY = 0;


async function onMapLoad(event: any) {
  console.log('Map loaded');

    if (focusLat != null && focusLng != null) {
        await focusTianguis(event, focusLat, focusLng);
    }else {
        console.warn('Could not find tianguis at', focusLat, focusLng);
    }

    
}

async function focusTianguis(event: any, focusLat: number, focusLng: number) {
    const tolerance = 0.0001;
    const focused = props.tianguis.find(
    (t) => t.lat && t.lng && Math.abs(t.lat - focusLat) < tolerance && Math.abs(t.lng - focusLng) < tolerance
    );

    if (focused) {
        console.log('Found focused tianguis:', focused.name);
        
        // Center and zoom to the selected tianguis
        setTimeout(() => {
            selectedTianguis.value = { ...focused };
            
            if (event.map) {
            event.map.flyTo({
                center: [focusLng, focusLat],
                zoom: 16,
                duration: 1500,
            });
            }
        }, 300);
    } 
}

function toggleSheet() {
  isSheetExpanded.value = !isSheetExpanded.value;
}

function formatLocation(tianguis: any) {
  if (tianguis.location?.type === 'address') {
    return tianguis.location.direccion;
  }
  if (tianguis.location?.type === 'streets') {
    const loc = tianguis.location;
    return `${loc.street1} / ${loc.street2}`;
  }
  if (tianguis.direccion) return tianguis.direccion;
  if (tianguis.street1) return `${tianguis.street1} / ${tianguis.street2 || ''}`;
  return 'Ubicación no disponible';
}

function getDayLabel(day: DayOfWeek): string {
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
  return municipality.charAt(0).toUpperCase() + municipality.slice(1);
}

function formatDistance(km: number): string {
  return formatDist(km);
}

function goBack() {
  window.history.back();
}

function centerOnUser() {
  if (userLocation.value && mapInstance.value?.map) {
    mapInstance.value.map.flyTo({
      center: [userLocation.value.lng, userLocation.value.lat],
      zoom: 14,
      duration: 1000,
    });
  }
}

function onGeolocate(event: any) {
  if (event.coords) {
    userLocation.value = {
      lat: event.coords.latitude,
      lng: event.coords.longitude,
    };
  }
}

function openInGoogleMaps() {
  if (selectedTianguis.value) {
    // Note: I also fixed a string interpolation bug here (`0{...}` instead of `${...}`) 
    // and updated to the standard Google Maps search URL formatting.
    const url = `https://www.google.com/maps/search/?api=1&query=${selectedTianguis.value.lat},${selectedTianguis.value.lng}`;
    window.open(url, '_blank');
  }
}

async function shareLocation() {
  if (!selectedTianguis.value) return;

  const shareData = {
    title: selectedTianguis.value.name,
    text: `${selectedTianguis.value.name} - ${formatLocation(selectedTianguis.value)}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('Enlace copiado al portapapeles');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
}

function handleTouchStart(event: TouchEvent) {
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event: TouchEvent) {
  if (!bottomSheet.value) return;

  const touchY = event.touches[0].clientY;
  const deltaY = touchStartY - touchY;

  if (deltaY > 0) {
    isSheetExpanded.value = true;
  } else if (deltaY < -50 && isSheetExpanded.value) {
    isSheetExpanded.value = false;
  }
}

function handleTouchEnd() {
  touchStartY = 0;
}

onMounted(() => {
  console.log('MobileMap mounted');
  console.log('Focus params:', {
    lat: focusLat ?? 'not provided',
    lng: focusLng ?? 'not provided',
    name: focusName ?? 'not provided',
  });

  // Watch for dark mode changes
  const observer = new MutationObserver(() => {
    const newIsDark = document.documentElement.classList.contains('dark');
    if (newIsDark !== isDarkMode.value) {
      isDarkMode.value = newIsDark;
      style.value = newIsDark
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
});
</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

/* Structural styles kept clean; colors moved to Tailwind template classes */
.mobile-map-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  flex: 1;
  position: relative;
  padding-top: 4rem;
  overflow: visible;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transition: transform 0.3s ease-out, max-height 0.3s ease-out;
  z-index: 20;
  max-height: 35vh;
  transform: translateY(100%);
}

.bottom-sheet.visible {
  transform: translateY(0);
}

.bottom-sheet.expanded {
  max-height: 75vh;
}

.rotate-180 {
  transform: rotate(180deg);
}

.custom-marker {
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.custom-marker.selected {
  transform: scale(1.3);
  filter: drop-shadow(0 3px 6px rgba(59, 130, 246, 0.5));
}

@media (min-width: 640px) {
  .bottom-sheet {
    max-width: 480px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
  }

  .bottom-sheet.visible {
    transform: translateX(-50%) translateY(0);
  }
}
</style>