/**
 * Day of the week in Spanish
 */
export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

/**
 * Base Tianguis interface
 */
export interface Tianguis {
  name: string;
  location: TianguisLocation;
  municipality: string;
  state: string;
  day: DayOfWeek;
  lat: number;
  lng: number;
}

/**
 * Base Tianguis interface with distance (used for search results)
 */
export interface TianguisWithDistance extends Tianguis {
  distance: number; // Distance in kilometers from user's location
}

/**
 * Location can be either street-based or address-based
 */
export type TianguisLocation = StreetLocation | AddressLocation;

export interface StreetLocation {
  type: 'streets';
  street1: string;
  street2: string;
  street3: string;
  street4: string;
}

export interface AddressLocation {
  type: 'address';
  direccion: string;
}

/**
 * Response structure from local JSON files (current format)
 */
export interface LocalTianguisData {
  [day: string]: Array<{
    name: string;
    street1?: string;
    street2?: string;
    street3?: string;
    street4?: string;
    direccion?: string;
    lat?: number;
    lng?: number;
  }>;
}

/**
 * API Response structure (for future backend)
 */
export interface ApiTianguisResponse {
  success: boolean;
  data: {
    state: string;
    municipality: string;
    tianguis: Tianguis[];
  };
  meta?: {
    total: number;
    page?: number;
    perPage?: number;
  };
}

/**
 * Query parameters for filtering tianguis
 */
export interface TianguisQuery {
  state?: string;
  municipality?: string;
  day?: DayOfWeek;
  search?: string;
}

/**
 * Municipality/City configuration
 */
export interface Municipality {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
}
