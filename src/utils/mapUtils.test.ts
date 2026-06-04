import { describe, it, expect } from 'vitest';
import { getMarkerColor } from './mapUtils';
import type { DayOfWeek } from '../types/tianguis';

describe('mapUtils', () => {
  describe('getMarkerColor', () => {
    const days: DayOfWeek[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    // Helper to check if a string is a valid hex color
    const isValidHexColor = (color: string): boolean => {
      return /^#[0-9A-Fa-f]{6}$/.test(color);
    };

    it('returns a valid hex color for all days of the week', () => {
      days.forEach(day => {
        const color = getMarkerColor(day);
        expect(isValidHexColor(color)).toBe(true);
      });
    });

    it('returns consistent colors for the same day', () => {
      days.forEach(day => {
        const color1 = getMarkerColor(day);
        const color2 = getMarkerColor(day);
        expect(color1).toBe(color2);
      });
    });

    it('returns a color for each day of the week', () => {
      days.forEach(day => {
        const color = getMarkerColor(day);
        expect(color).toBeTruthy();
        expect(typeof color).toBe('string');
      });
    });

    it('returns a valid default color for invalid day', () => {
      const color = getMarkerColor('invalid' as DayOfWeek);
      expect(isValidHexColor(color)).toBe(true);
    });
  });
});
