/**
 * Text utilities for search and normalization
 */

/**
 * Remove accents/diacritics from text for accent-insensitive search
 * Examples:
 * - "Sección" -> "Seccion"
 * - "José María" -> "Jose Maria"
 * - "Miércoles" -> "Miercoles"
 */
export function removeAccents(text: string): string {
  return text
    .normalize('NFD') // Decompose combined characters into base + diacritics
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritic marks
}

/**
 * Normalize text for searching (lowercase + no accents)
 */
export function normalizeForSearch(text: string): string {
  return removeAccents(text).toLowerCase();
}

/**
 * Check if a text matches a search query (accent-insensitive, case-insensitive)
 */
export function matchesSearch(text: string, query: string): boolean {
  return normalizeForSearch(text).includes(normalizeForSearch(query));
}
