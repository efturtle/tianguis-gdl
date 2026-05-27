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
        <div class="tianguis-popup">
          <h3 class="popup-title">{{ tianguis.name }}</h3>
          <div class="popup-content">
            <p class="popup-location">
              <strong>📍 Ubicación:</strong><br />
              {{ formatLocation(tianguis) }}
            </p>
            <p class="popup-day">
              <strong>📅 Día:</strong> <span class="day-badge">{{ capitalizeDay(tianguis.day) }}</span>
            </p>
            <p class="popup-municipality">
              <strong>🏙️ Municipio:</strong> {{ capitalizeMunicipality(tianguis.municipality) }}
            </p>
          </div>
        </div>
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
import { computed, watch } from 'vue';

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

const style = 'https://api.maptiler.com/maps/streets-v2/style.json?key=ccXSAsFlfLeYXX5rJs4o';
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

// Format location string
function formatLocation(tianguis) {
  if (tianguis.location?.type === 'address') {
    return tianguis.location.direccion;
  } else if (tianguis.location?.type === 'streets') {
    const loc = tianguis.location;
    return `${loc.street2}, ${loc.street1}`;
  }
  // Fallback for raw data
  if (tianguis.direccion) return tianguis.direccion;
  if (tianguis.street2) return `${tianguis.street2}, ${tianguis.street1 || ''}`;
  return 'Ubicación no disponible';
}

// Capitalize day name
function capitalizeDay(day) {
  const days = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };
  return days[day] || day;
}

// Capitalize municipality
function capitalizeMunicipality(municipality) {
  return municipality.charAt(0).toUpperCase() + municipality.slice(1);
}

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

</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

.tianguis-popup {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 280px;
}

.popup-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #3b82f6;
}

.popup-content {
  font-size: 13px;
  
  p {
    margin: 8px 0;
    color: #4b5563;
    line-height: 1.5;
  }
  
  strong {
    color: #1f2937;
    display: inline-block;
    margin-bottom: 2px;
  }
}

.popup-location {
  margin-bottom: 12px;
}

.day-badge {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.popup-municipality {
  color: #6b7280;
  font-size: 12px;
}

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