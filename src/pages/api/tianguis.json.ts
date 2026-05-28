import type { APIRoute } from 'astro';
import { TianguisService } from '../../services/tianguis';

export const GET: APIRoute = async () => {
  try {
    // Get all tianguis from all municipalities
    const allTianguis = await TianguisService.getTianguis();

    return new Response(JSON.stringify(allTianguis), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching tianguis:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch tianguis data',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
