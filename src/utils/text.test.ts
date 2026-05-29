import { describe, it, expect } from 'vitest';
import { removeAccents, normalizeForSearch, matchesSearch } from './text';

describe('Text Utilities', () => {
  describe('removeAccents', () => {
    it('removes acute accents from vowels', () => {
      expect(removeAccents('áéíóúÁÉÍÓÚ')).toBe('aeiouAEIOU');
    });

    it('removes diacritics from consonants (e.g., ñ)', () => {
      // Note: The NFD normalization decomposes 'ñ' into 'n' + '~'
      expect(removeAccents('niño NIÑO')).toBe('nino NINO');
    });

    it('leaves text without accents completely unchanged', () => {
      const normalText = 'Hola Mundo 123! @#$';
      expect(removeAccents(normalText)).toBe(normalText);
    });
  });

  describe('normalizeForSearch', () => {
    it('converts text to lowercase and removes accents simultaneously', () => {
      expect(normalizeForSearch('Sección')).toBe('seccion');
      expect(normalizeForSearch('José María')).toBe('jose maria');
      expect(normalizeForSearch('MIÉRCOLES')).toBe('miercoles');
    });

    it('handles empty strings gracefully', () => {
      expect(normalizeForSearch('')).toBe('');
    });
  });

  describe('matchesSearch', () => {
    it('returns true for an exact match', () => {
      expect(matchesSearch('Tianguis del Sol', 'Tianguis del Sol')).toBe(true);
    });

    it('returns true for a partial substring match', () => {
      expect(matchesSearch('Tianguis del Sol', 'Sol')).toBe(true);
      expect(matchesSearch('Tianguis del Sol', 'Tiang')).toBe(true);
    });

    it('returns true regardless of case and accent differences', () => {
      // The source has no accents, but the query does
      expect(matchesSearch('Tianguis de Zapopan', 'ZAPOPÁN')).toBe(true);
      
      // The source has accents, but the query does not
      expect(matchesSearch('Sección 3', 'seccion')).toBe(true);
    });

    it('returns false when the query is nowhere in the text', () => {
      expect(matchesSearch('Tianguis de Mezquitan', 'Tonalá')).toBe(false);
    });
  });
});