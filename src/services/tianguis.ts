import type {
  Tianguis,
  TianguisQuery,
  LocalTianguisData,
  ApiTianguisResponse,
  DayOfWeek,
  TianguisLocation,
} from '../types/tianguis';
import { MUNICIPALITIES } from '../config/municipalities';
import { normalizeForSearch } from '../utils/text';

/**
 * Configuration for data source
 * Change this to 'api' when backend is ready
 */
const DATA_SOURCE: 'local' | 'api' = 'local';
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Import all JSON files from the data directory
 * This is required for production builds to work correctly
 */
const dataFiles = import.meta.glob<LocalTianguisData>('../data/*.json', { eager: true, import: 'default' });

/**
 * Main service class for fetching tianguis data
 * This abstraction allows easy switching between local JSON and backend API
 */
export class TianguisService {
  /**
   * Get tianguis data for a specific municipality
   */
  static async getTianguisByMunicipality(
    state: string,
    municipality: string
  ): Promise<Tianguis[]> {
    if (DATA_SOURCE === 'local') {
      return this.getLocalData(state, municipality);
    } else {
      return this.getApiData({ state, municipality });
    }
  }

  /**
   * Get tianguis filtered by query parameters
   */
  static async getTianguis(query: TianguisQuery = {}): Promise<Tianguis[]> {
    if (DATA_SOURCE === 'local') {
      const { municipality, state = 'jalisco' } = query;
      
      let data: Tianguis[] = [];
      
      if (municipality) {
        // Load single municipality
        data = await this.getLocalData(state, municipality);
      } else {
        // Load all municipalities
        data = await this.getAllLocalData(state);
      }
      
      return this.filterTianguis(data, query);
    } else {
      return this.getApiData(query);
    }
  }

  /**
   * Get tianguis for a specific day
   */
  static async getTianguisByDay(
    day: DayOfWeek,
    municipality?: string
  ): Promise<Tianguis[]> {
    const data = await this.getTianguis({ day, municipality });
    return data;
  }

  /**
   * Fetch data from local JSON files (current implementation)
   */
  private static async getLocalData(
    state: string,
    municipality: string
  ): Promise<Tianguis[]> {
    try {
      // Get the data from the pre-loaded files
      const dataPath = `../data/${municipality}.json`;
      const data = dataFiles[dataPath];

      if (!data) {
        console.error(`No data found for ${municipality}`);
        return [];
      }

      return this.normalizeLocalData(data, state, municipality);
    } catch (error) {
      console.error(`Failed to load data for ${municipality}:`, error);
      return [];
    }
  }

  /**
   * Fetch data from all municipalities in a state
   */
  private static async getAllLocalData(state: string): Promise<Tianguis[]> {
    const allTianguis: Tianguis[] = [];
    
    // Get all municipalities for the state
    const municipalities = MUNICIPALITIES.filter(m => m.stateSlug === state);
    
    // Load data from each municipality
    for (const municipality of municipalities) {
      const data = await this.getLocalData(state, municipality.slug);
      allTianguis.push(...data);
    }
    
    return allTianguis;
  }

  /**
   * Fetch data from backend API (future implementation)
   */
  private static async getApiData(query: TianguisQuery): Promise<Tianguis[]> {
    try {
      const params = new URLSearchParams();
      if (query.state) params.append('state', query.state);
      if (query.municipality) params.append('municipality', query.municipality);
      if (query.day) params.append('day', query.day);
      if (query.search) params.append('search', query.search);

      const response = await fetch(`${API_BASE_URL}/tianguis?${params}`);
      const result: ApiTianguisResponse = await response.json();

      if (!result.success) {
        throw new Error('API request failed');
      }

      return result.data.tianguis;
    } catch (error) {
      console.error('Failed to fetch from API:', error);
      return [];
    }
  }

  /**
   * Normalize local JSON data to standard Tianguis format
   */
  private static normalizeLocalData(
    data: LocalTianguisData,
    state: string,
    municipality: string
  ): Tianguis[] {
    const tianguis: Tianguis[] = [];

    for (const [day, items] of Object.entries(data)) {
      for (const item of items) {
        let location: TianguisLocation;

        // Handle different location formats
        if (item.street1) {
          location = {
            type: 'streets',
            street1: item.street1,
            street2: item.street2 || '',
            street3: item.street3 || '',
            street4: item.street4 || '',
          };
        } else if (item.direccion) {
          location = {
            type: 'address',
            direccion: item.direccion,
          };
        } else {
          continue; // Skip invalid entries
        }

        tianguis.push({
          name: item.name,
          location,
          municipality: municipality,
          state: state,
          day: day as DayOfWeek,
          lat: item.lat || 0, // Default to 0 if not provided
          lng: item.lng || 0, // Default to 0 if not provided
        });
      }
    }

    return tianguis;
  }

  /**
   * Filter tianguis based on query parameters
   * Search is accent-insensitive (e.g., "seccion" matches "Sección")
   */
  private static filterTianguis(
    tianguis: Tianguis[],
    query: TianguisQuery
  ): Tianguis[] {
    let filtered = tianguis;

    if (query.day) {
      filtered = filtered.filter((t) => t.day === query.day);
    }

    if (query.search) {
      const normalizedQuery = normalizeForSearch(query.search);
      filtered = filtered.filter((t) =>
        normalizeForSearch(t.name).includes(normalizedQuery)
      );
    }

    return filtered;
  }
}

/**
 * Helper function to format location for display
 */
export function formatLocation(location: TianguisLocation): string {
  if (location.type === 'address') {
    return location.direccion;
  } else {
    return `${location.street1} entre ${location.street2}, ${location.street3} y ${location.street4}`;
  }
}
