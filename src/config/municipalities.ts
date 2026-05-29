import type { Municipality } from '../types/tianguis';

/**
 * Configuration for all supported municipalities
 * Add new municipalities here as you expand
 */
export const MUNICIPALITIES: Municipality[] = [
  {
    slug: 'guadalajara',
    name: 'Guadalajara',
    state: 'Jalisco',
    stateSlug: 'jalisco',
  },
  {
    slug: 'zapopan',
    name: 'Zapopan',
    state: 'Jalisco',
    stateSlug: 'jalisco',
  },
  // Add more municipalities here as needed
  // {
  //   slug: 'tlaquepaque',
  //   name: 'Tlaquepaque',
  //   state: 'Jalisco',
  //   stateSlug: 'jalisco',
  // },
];

/**
 * Get municipality by slug
 */
export function getMunicipalityBySlug(slug: string): Municipality | undefined {
  return MUNICIPALITIES.find((m) => m.slug === slug);
}

/**
 * Get all municipalities for a state
 */
export function getMunicipalitiesByState(stateSlug: string): Municipality[] {
  return MUNICIPALITIES.filter((m) => m.stateSlug === stateSlug);
}

/**
 * States configuration
 */
export const STATES = [
  {
    slug: 'jalisco',
    name: 'Jalisco',
  },
  // Add more states as you expand
];
