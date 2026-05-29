<template>
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
</template>

<script setup lang="ts">
import type { DayOfWeek } from '../types/tianguis';

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
  return municipality.charAt(0).toUpperCase() + municipality.slice(1);
}
</script>

<style scoped>
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

:global(.dark) .popup-title {
  color: rgb(243 244 246);
  border-bottom-color: rgb(96 165 250);
}

.popup-content {
  font-size: 13px;
}

.popup-content p {
  margin: 8px 0;
  color: #4b5563;
  line-height: 1.5;
}

:global(.dark) .popup-content p {
  color: rgb(156 163 175);
}

.popup-content strong {
  color: #1f2937;
  display: inline-block;
  margin-bottom: 2px;
}

:global(.dark) .popup-content strong {
  color: rgb(209 213 219);
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

:global(.dark) .day-badge {
  background: rgba(59, 130, 246, 0.2);
  color: rgb(147, 197, 253);
}

.popup-municipality {
  color: #6b7280;
  font-size: 12px;
}

:global(.dark) .popup-municipality {
  color: rgb(156 163 175);
}
</style>
