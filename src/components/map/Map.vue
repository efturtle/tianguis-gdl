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
      color="#3B82F6"
    >
      <mgl-popup :offset="25">
        <TianguisPopup :tianguis="tianguis" />
      </mgl-popup>
    </mgl-marker>
  </mgl-map>
</template>

<script setup>
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglScaleControl,
  MglMarker,
  MglPopup,
} from '@indoorequal/vue-maplibre-gl';
import { computed, onMounted, watch, ref } from 'vue';
import TianguisPopup from './TianguisPopup.vue';

// Props
const props = defineProps({
  tianguis: {
    type: Array,
    default: () => []
  },
  initialCenter: {
    type: Array,
    default: () => [-103.3496, 20.6597] // Guadalajara center
  },
  initialZoom: {
    type: Number,
    default: 12
  }
});

// Reactive map style that switches based on dark mode
const isDarkMode = ref(document.documentElement.classList.contains('dark'));
const style = ref(
  isDarkMode.value
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
);
const center = computed(() => {
  // If we have tianguis with coords, center on the first one
  if (props.tianguis.length > 0 && props.tianguis[0].lat && props.tianguis[0].lng) {
    return [props.tianguis[0].lng, props.tianguis[0].lat];
  }
  return props.initialCenter;
});
const zoom = props.initialZoom;

// Filter tianguis that have coordinates
const tianguisWithCoords = computed(() => {
  return props.tianguis.filter(t => t.lat && t.lng);
});

// Map load handler
function onMapLoad(event) {
  console.log(`Map loaded with ${tianguisWithCoords.value.length} markers`);
  
  // Fit bounds to show all markers if we have multiple
  if (tianguisWithCoords.value.length > 1 && event.map) {
    // Create bounds from all tianguis coordinates
    const coordinates = tianguisWithCoords.value.map(t => [t.lng, t.lat]);
    
    // Calculate bounding box
    const lngs = coordinates.map(c => c[0]);
    const lats = coordinates.map(c => c[1]);
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

onMounted(() => {
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