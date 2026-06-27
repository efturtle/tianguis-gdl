import type { DayOfWeek } from '../types/tianguis';

/**
 * Map utilities for handling map-related operations
 */

/**
 * Get marker color based on the day of the week
 * Returns a hex color code for each day with gradient effect
 * Weekdays progressively get darker from Monday to Thursday
 * Weekend days progressively get darker from Friday to Sunday
 */
export function getMarkerColor(day: DayOfWeek): string {
  const dayColors: Record<DayOfWeek, string> = {
    // Weekdays - gray gradient (lighter to darker)
    lunes: '#6B7280',    // Light gray
    martes: '#52525B',   // Medium-light gray
    miercoles: '#3F3F46', // Medium-dark gray
    jueves: '#27272A',   // Dark gray
    
    // Weekend - red/orange gradient (lighter to darker)
    viernes: '#DC2626',  // Bright red
    sabado: '#B91C1C',   // Medium red
    domingo: '#991B1B',  // Dark red
  };
  return dayColors[day] || '#a78bfa'; // Default to soft purple if day not found
}
