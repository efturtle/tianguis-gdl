// src/utils/reportIssue.ts
import { getUserLocation } from './geolocation';

export async function reportIssue(selectedTianguis: { name?: string; lat?: number; lng?: number } | null) {
  if (!selectedTianguis) return;

  try {
    const userLocation = await getUserLocation();

    const formUrl = new URL('https://docs.google.com/forms/d/e/1FAIpQLSe-RKk6CqLihilzkfq_hZIccQtyXB_Vj7GfaeAdnKEsgtGYTQ/viewform?usp=pp_url&entry.990713192=Nombre_aqui&entry.413180923=Coordenandas_sistema&entry.1348562940=Coordenadas_reales&entry.273176323=La+ubicacion+en+el+mapa+es+incorrecta');
    formUrl.searchParams.set('entry.990713192', selectedTianguis?.name || 'N/A');
    formUrl.searchParams.set('entry.413180923', `${selectedTianguis?.lat || 'N/A'}, ${selectedTianguis?.lng || 'N/A'}`);
    formUrl.searchParams.set('entry.1348562940', userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'No se pudo obtener la ubicación del usuario');
    formUrl.searchParams.set('entry.273176323', 'No');
    window.open(formUrl.toString(), '_blank');
  } catch (error) {
    console.error('Error getting user location for report:', error);
  }
}