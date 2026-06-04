<template>
  <mgl-map
    :map-style="style"
    :center="center"
    :zoom="zoom"
    height="100%"
    @map:load="onMapLoad"
  >
    <mgl-navigation-control position="top-right" />
    <mgl-geolocate-control position="top-right" />
    <mgl-scale-control position="bottom-left" />

    <!-- Markers for each tianguis with coordinates -->
    <mgl-marker
      v-for="(tianguis, index) in tianguisWithCoords"
      :key="`${tianguis.name}-${index}`"
      :coordinates="[tianguis.lng, tianguis.lat]"
      :color="getMarkerColor(tianguis.day)"
    >
      <mgl-popup :offset="25">
        <TianguisPopup :tianguis="tianguis" />
      </mgl-popup>
    </mgl-marker>
  </mgl-map>
</template>

<script setup lang="ts">
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglScaleControl,
  MglMarker,
  MglPopup,
} from '@indoorequal/vue-maplibre-gl';
import { computed, onMounted, onUnmounted, watch, ref } from 'vue';
import TianguisPopup from './TianguisPopup.vue';
import { getMarkerColor } from '../../utils/mapUtils';
import type { Tianguis } from '../../types/tianguis';

// Disable automatic attribute inheritance to prevent warnings with MglMap
defineOptions({
  inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<{
  tianguis: Tianguis[];
  initialZoom?: number;
}>(), {
  tianguis: () => [],
  initialZoom: 12
});

// Reactive map style that switches based on dark mode
const isDarkMode = ref(document.documentElement.classList.contains('dark'));
const style = ref(
  isDarkMode.value
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
);
const center = computed((): [number, number] => {
  // If we have tianguis with coords, center on the first one
  if (props.tianguis.length > 0 && props.tianguis[0].lat && props.tianguis[0].lng) {
    return [props.tianguis[0].lng, props.tianguis[0].lat];
  }
  return [-103.3496, 20.6597]; // Default to Guadalajara center
});
const zoom = props.initialZoom;
const map = ref<any>(null);
const selectedMarkerId = ref<string | null>(null);

// Filter tianguis that have coordinates
const tianguisWithCoords = computed(() => {
  return props.tianguis.filter((t) => t.lat && t.lng);
});

function getTianguisId(tianguis: Tianguis) {
  return `${tianguis.name}-${tianguis.lat}-${tianguis.lng}`;
}

function focusMarker({ id, lat, lng }: { id?: string; lat: number; lng: number }) {
  if (!map.value || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return;
  }

  if (id) {
    selectedMarkerId.value = id;
  } else {
    const selected = tianguisWithCoords.value.find(
      (t) => t.lat === lat && t.lng === lng
    );

    if (selected) {
      selectedMarkerId.value = getTianguisId(selected);
    }
  }

  map.value.flyTo({
    center: [lng, lat],
    zoom: 14,
    duration: 1000,
    essential: true,
  });
}

function onFocusMap(event: Event) {
  const detail = (event as CustomEvent<{ id?: string; lat: number; lng: number }>)?.detail;

  if (!detail) {
    return;
  }

  focusMarker(detail);
}

// Map load handler
function onMapLoad(event: { map: any }) {
  map.value = event.map;
  console.log(`Map loaded with ${tianguisWithCoords.value.length} markers`);

  // Fit bounds to show all markers if we have multiple
  if (tianguisWithCoords.value.length > 1 && event.map) {
    // Create bounds from all tianguis coordinates
    const coordinates = tianguisWithCoords.value.map((t) => [t.lng, t.lat]);

    // Calculate bounding box
    const lngs = coordinates.map((c) => c[0]);
    const lats = coordinates.map((c) => c[1]);
    const bounds = [
      [Math.min(...lngs), Math.min(...lats)], // Southwest
      [Math.max(...lngs), Math.max(...lats)]  // Northeast
    ];

    event.map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
  }
}

// Watch for tianguis changes and log stats
watch(() => props.tianguis, (newTianguis) => {
  const withCoords = newTianguis.filter(t => t.lat && t.lng).length;
  const withoutCoords = newTianguis.length - withCoords;
  console.log(`📊 Tianguis stats: ${withCoords} with coords, ${withoutCoords} without coords`);
}, { immediate: true });

let observer: MutationObserver;

onMounted(() => {
  window.addEventListener('tianguis:focus-map', onFocusMap);

  // Watch for dark mode changes
  observer = new MutationObserver(() => {
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

onUnmounted(() => {
  window.removeEventListener('tianguis:focus-map', onFocusMap);

  if (observer) {
    observer.disconnect();
  }
});

</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

/* Customize popup styles */
:deep(.maplibregl-popup-content) {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.maplibregl-popup-close-button) {
  font-size: 20px;
  padding: 4px 8px;
  color: #6b7280;
  
  &:hover {
    color: #1f2937;
    background: transparent;
  }
}

:deep(.maplibregl-popup-tip) {
  border-top-color: white;
}
</style>