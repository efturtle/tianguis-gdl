<template>
  <div class="search-dashboard">
    <!-- Updated: Replaced CSS background/border with Tailwind classes -->
    <div
      class="search-header sticky top-0 z-10 px-4 pt-4 pb-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Encuentra tu Tianguis
        </h1>
        <DarkModeToggle />
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Busca por ubicación o nombre de colonia
      </p>

      <div class="relative mb-3">
        <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Buscar colonia, calle o nombre..."
          class="w-full px-4 py-3 pl-10 pr-4 text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors" />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <button @click="findNearby" :disabled="isLoadingLocation"
        class="w-full py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
        <svg class="w-5 h-5" :class="{ 'animate-pulse': isLoadingLocation }" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ isLoadingLocation ? 'Buscando ubicación...' : 'Usar mi ubicación' }}
      </button>

      <div class="mt-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Filtrar por municipio</label>
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button v-for="municipality in municipalities" :key="municipality.value"
            @click="toggleMunicipalityFilter(municipality.value)"
            class="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors" :class="selectedMunicipalities.includes(municipality.value)
              ? 'bg-blue-600 dark:bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              ">
            {{ municipality.label }}
          </button>
        </div>
      </div>

      <div class="mt-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Filtrar por día</label>
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button v-for="day in days" :key="day.value" @click="toggleDayFilter(day.value)"
            class="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors" :class="selectedDays.includes(day.value)
              ? 'bg-blue-600 dark:bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              ">
            {{ day.label }}
          </button>
        </div>
      </div>

      <div v-if="errorMessage"
        class="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg text-red-700 dark:text-red-400 text-sm">
        {{ errorMessage }}
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500">
      </div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando tianguis...</p>
    </div>

    <div v-else-if="filteredTianguis.length > 0" class="p-4 dark:bg-gray-900">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ resultsTitle }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ filteredTianguis.length }} tianguis encontrados
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <TianguisCard v-for="tianguis in filteredTianguis" :key="`${tianguis.name}-${tianguis.day}`"
          :tianguis="tianguis" />
      </div>
    </div>

    <div v-else-if="!isLoading" class="p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-600 dark:text-gray-400 text-center">
        {{ searchQuery ? 'No se encontraron tianguis' : 'Busca tianguis cerca de ti o por nombre de colonia' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { TianguisWithDistance, DayOfWeek } from '../../types/tianguis.ts';
import { getUserLocation, calculateDistance } from '../../utils/geolocation.ts';
import { normalizeForSearch } from '../../utils/text.ts';
import { TianguisService } from '../../services/tianguis.ts';
import DarkModeToggle from './../ui/DarkModeToggle.vue';
import TianguisCard from './../tianguis/TianguisCard.vue';

const searchQuery = ref('');
const allTianguis = ref<TianguisWithDistance[]>([]);
const isLoading = ref(true);
const isLoadingLocation = ref(false);
const errorMessage = ref('');
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const selectedDays = ref<DayOfWeek[]>([]);
const selectedMunicipalities = ref<string[]>([]);

const days = [
  { value: 'lunes' as DayOfWeek, label: 'Lun' },
  { value: 'martes' as DayOfWeek, label: 'Mar' },
  { value: 'miercoles' as DayOfWeek, label: 'Mié' },
  { value: 'jueves' as DayOfWeek, label: 'Jue' },
  { value: 'viernes' as DayOfWeek, label: 'Vie' },
  { value: 'sabado' as DayOfWeek, label: 'Sáb' },
  { value: 'domingo' as DayOfWeek, label: 'Dom' },
];

const municipalities = [
  { value: 'guadalajara', label: 'Guadalajara' },
  { value: 'zapopan', label: 'Zapopan' },
  // { value: 'tlaquepaque', label: 'Tlaquepaque' },
  // { value: 'tonala', label: 'Tonala' },
  // { value: 'tlajomulco', label: 'Tlajomulco' },
  // { value: 'el salto', label: 'El Salto' },
  // { value: 'ixtlahuacan', label: 'Ixtlahuacan' },
  // { value: 'juanacatlan', label: 'Juanacatlan' },
  // { value: 'zapotlanejo', label: 'Zapotlanejo' },
];

const resultsTitle = computed(() => {
  if (userLocation.value) {
    return 'Tianguis cerca de ti';
  }
  if (searchQuery.value) {
    return 'Resultados de búsqueda';
  }
  return 'Todos los tianguis';
});

const filteredTianguis = computed(() => {
  let results = [...allTianguis.value];

  if (searchQuery.value) {
    const normalizedQuery = normalizeForSearch(searchQuery.value);
    results = results.filter((t) => {
      const nameMatch = normalizeForSearch(t.name).includes(normalizedQuery);
      const municipalityMatch = normalizeForSearch(t.municipality).includes(normalizedQuery);

      let locationMatch = false;
      if (t.location.type === 'streets') {
        locationMatch = [
          t.location.street1,
          t.location.street2,
          t.location.street3,
          t.location.street4,
        ].some((street) => normalizeForSearch(street).includes(normalizedQuery));
      } else {
        locationMatch = normalizeForSearch(t.location.direccion).includes(normalizedQuery);
      }

      return nameMatch || municipalityMatch || locationMatch;
    });
  }

  if (selectedDays.value.length > 0) {
    results = results.filter((t) => selectedDays.value.includes(t.day));
  }
  if (selectedMunicipalities.value.length > 0) {
    results = results.filter((t) => selectedMunicipalities.value.includes(t.municipality));
  }

  if (results.some((t) => t.distance !== undefined)) {
    results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  }

  return results;
});

function toggleDayFilter(day: DayOfWeek) {
  const index = selectedDays.value.indexOf(day);
  if (index > -1) {
    selectedDays.value.splice(index, 1);
  } else {
    selectedDays.value.push(day);
  }
}

function toggleMunicipalityFilter(municipality: string) {
  const index = selectedMunicipalities.value.indexOf(municipality);
  if (index > -1) {
    selectedMunicipalities.value.splice(index, 1);
  } else {
    selectedMunicipalities.value.push(municipality);
  }
}

async function findNearby() {
  isLoadingLocation.value = true;
  errorMessage.value = '';

  try {
    const location = await getUserLocation();
    userLocation.value = location;

    // Calculate distances for all tianguis
    allTianguis.value = allTianguis.value.map((tianguis) => ({
      ...tianguis,
      distance: calculateDistance(location, { lat: tianguis.lat, lng: tianguis.lng }),
    }));
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al obtener ubicación';
  } finally {
    isLoadingLocation.value = false;
  }
}

function handleSearch() { }

onMounted(async () => {
  // Load filters from URL parameters
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) searchQuery.value = params.get('q')!;
  if (params.get('days')) {
    selectedDays.value.splice(0, selectedDays.value.length, ...params.get('days')!.split(',') as DayOfWeek[]);
  }
  if (params.get('municipalities')) {
    selectedMunicipalities.value.splice(0, selectedMunicipalities.value.length, ...params.get('municipalities')!.split(','));
  }
});

watch([searchQuery, selectedMunicipalities, selectedDays], () => {
  // Clear location filter when user starts typing a search query
  if (searchQuery.value) {
    userLocation.value = null;
  }
  const params = new URLSearchParams();
  if (searchQuery.value) params.set('q', searchQuery.value);
  if (selectedDays.value.length) params.set('days', selectedDays.value.join(','));
  if (selectedMunicipalities.value.length) params.set('municipalities', selectedMunicipalities.value.join(','));
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
},
  { deep: true });
</script>

<style scoped>
.search-dashboard {
  max-width: 100%;
  margin: 0 auto;
}

/* Optional: Hide scrollbar for the days filter */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (min-width: 768px) {
  .search-dashboard {
    max-width: 768px;
  }
}
</style>