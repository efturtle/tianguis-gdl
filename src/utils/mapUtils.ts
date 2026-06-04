import type { DayOfWeek } from '../types/tianguis';

/**
 * Map utilities for handling map-related operations
 */

/**
 * Get marker color based on the day of the week
 * Returns a hex color code for each day
 */
export function getMarkerColor(day: DayOfWeek): string {
  const dayColors: Record<DayOfWeek, string> = {
    lunes: '#4A4A4A', // gris plomo
    martes: '#4A4A4A', // naranja cempasuchil
    miercoles: '#4A4A4A', // verde limon
    jueves: '#4A4A4A', // rojo ladrillo
    viernes: '#A13D2D', // rosa mexicano
    sabado: '#A13D2D', // dorado
    domingo: '#A13D2D', // blanco
  };
  return dayColors[day] || '#a78bfa'; // Default to soft purple if day not found
}
