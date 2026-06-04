<template>
  <div class="mobile-map-container bg-gray-50 dark:bg-gray-900">
    <div
      class="map-header absolute top-0 inset-x-0 z-10 flex justify-between items-center py-3 px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <button @click="goBack"
        class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-200 active:scale-[0.98] active:bg-gray-50 dark:active:bg-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Volver</span>
      </button>
      <!-- take home -->
       <div class="flex gap-0">
        <a href="/" class="href">
          Tianguis
        </a>
       </div>
      <div class="flex gap-2">
        <DarkModeToggle />
        <button @click="centerOnUser"
          class="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-blue-500 dark:text-blue-400 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:text-gray-400 dark:disabled:text-gray-500 active:not-disabled:scale-95 active:not-disabled:bg-blue-50 dark:active:not-disabled:bg-gray-700"
          :disabled="!userLocation">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="map-wrapper" ref="mapContainer">
      <mgl-map ref="mapInstance" :map-style="style" :center="mapCenter" :zoom="mapZoom" height="100%"
        @map:load="onMapLoad">
        <mgl-navigation-control position="top-right" />
        <mgl-geolocate-control position="top-right" @geolocate="onGeolocate" />

        <mgl-marker v-for="tianguis in displayedTianguis" :key="`${tianguis.name}-${tianguis.lat}-${tianguis.lng}`"
          :coordinates="[tianguis.lng, tianguis.lat]"
          :color="getMarkerColor(tianguis.day)">
          <mgl-popup :offset="25">
            <TianguisPopup :tianguis="tianguis" />
          </mgl-popup>
        </mgl-marker>

        <mgl-marker v-if="selectedTianguis" :coordinates="[selectedTianguis.lng, selectedTianguis.lat]"
          :color="getMarkerColor(selectedTianguis.day)">
          <mgl-popup :offset="25">
            <TianguisPopup :tianguis="selectedTianguis" />
          </mgl-popup>
        </mgl-marker>
      </mgl-map>
    </div>

    <MapSheet :selectedTianguis="selectedTianguis" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglMarker,
  MglPopup,
} from '@indoorequal/vue-maplibre-gl';
import { calculateDistance, getUserLocation } from '../../utils/geolocation';
import { getMarkerColor } from '../../utils/mapUtils';
import type { TianguisWithDistance } from '../../types/tianguis';
import TianguisPopup from './TianguisPopup.vue';
import DarkModeToggle from './../ui/DarkModeToggle.vue';
import MapSheet from '../ui/MapSheet.vue';

const props = defineProps<{
  tianguis: TianguisWithDistance[];
}>();

// Refs & State
const mapInstance = ref<any>(null);
const selectedTianguis = ref<TianguisWithDistance | null>(null);
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const displayedTianguis = ref<TianguisWithDistance[]>([]);

// Map configuration state
const isDarkMode = ref(false);
const style = ref('');
const mapCenter = ref<[number, number]>([-103.3496, 20.6597]);
const mapZoom = ref(12);

let observer: MutationObserver | null = null;

// Update the map style based on the HTML class
function updateTheme() {
  isDarkMode.value = document.documentElement.classList.contains('dark');
  style.value = isDarkMode.value
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
}

async function onMapLoad(event: any) {
  const urlParams = new URLSearchParams(window.location.search);
  const focusLat = urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : null;
  const focusLng = urlParams.get('lng') ? parseFloat(urlParams.get('lng')!) : null;

  if (focusLat !== null && focusLng !== null) {
    await focusTianguis(event.map, focusLat, focusLng);
  } else {
    await markNearestOnes(event.map);
  }
}

async function markNearestOnes(mapObject: any) {
  try {
    userLocation.value = await getUserLocation();

    const tianguisData = [...props.tianguis];
    tianguisData.forEach((t) => {
      if (t.lat && t.lng && userLocation.value) {
        t.distance = calculateDistance(userLocation.value, { lat: t.lat, lng: t.lng });
      }
    });

    // Sort by distance and take the nearest 5
    const nearest = tianguisData
      .filter((t) => t.lat && t.lng && t.distance !== undefined)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);

    displayedTianguis.value = nearest;

    if (nearest.length > 0 && mapObject) {
      setTimeout(() => {
        mapObject.flyTo({
          center: [nearest[0].lng, nearest[0].lat],
          zoom: 14,
          duration: 1500,
        });
      }, 500);
    }
  } catch (error) {
    console.error('Error getting user location:', error);
  }
}

async function focusTianguis(mapObject: any, focusLat: number, focusLng: number) {
  const tolerance = 0.0001;
  const focused = props.tianguis.find(
    (t) => t.lat && t.lng && Math.abs(t.lat - focusLat) < tolerance && Math.abs(t.lng - focusLng) < tolerance
  );

  if (focused) {
    displayedTianguis.value = [focused];

    setTimeout(() => {
      selectedTianguis.value = { ...focused };
      if (mapObject) {
        mapObject.flyTo({
          center: [focusLng, focusLat],
          zoom: 16,
          duration: 1500,
        });
      }
    }, 300);
  }
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

// Lifecycle Hooks
onMounted(() => {
  updateTheme();

  observer = new MutationObserver(() => {
    updateTheme();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
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