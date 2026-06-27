<template>
    <div class="mobile-map-view h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <!-- Header with filters -->
        <div
            class="header-filters bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm z-20">
            <div class="px-4 py-3">
                <!-- Logo/Title -->
                <div class="flex items-center justify-between mb-3">
                    <a href="/" class="flex items-center gap-2">
                        <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tianguis GDL</h1>
                    </a>
                    <div class="flex items-center gap-2">
                        <button @click="showSearch = !showSearch"
                            class="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': showSearch }">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <DarkModeToggle />
                    </div>
                </div>

                <!-- Filters Row -->
                <div class="flex gap-2">
                    <!-- Municipality Filter -->
                    <div class="flex-1">
                        <button @click="toggleMunicipalityDropdown"
                            class="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98]">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span class="truncate">{{ selectedMunicipality }}</span>
                            </div>
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    <!-- Day Filter -->
                    <div class="flex-1">
                        <button @click="toggleDayDropdown"
                            class="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98]">
                            <div class="flex items-center gap-2">
                                <svg v-if="selectedDay === 'Todos'" class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span v-else class="w-3 h-3 rounded-full shrink-0"
                                    :style="{ backgroundColor: getDayColor(selectedDay) }"></span>
                                <span class="truncate capitalize">{{ selectedDay }}</span>
                            </div>
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Dropdown Menus (positioned absolutely) -->
                <!-- Municipality Dropdown -->
                <div v-if="showMunicipalityDropdown"
                    class="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-30">
                    <button v-for="municipality in municipalities" :key="municipality"
                        @click="selectMunicipality(municipality)"
                        class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium': selectedMunicipality === municipality }">
                        {{ municipality }}
                    </button>
                </div>

                <!-- Day Dropdown -->
                <div v-if="showDayDropdown"
                    class="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-30">
                    <!-- All Days Option -->
                    <button @click="selectDay('Todos')"
                        class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-200 dark:border-gray-700"
                        :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium': selectedDay === 'Todos' }">
                        Todos los días
                    </button>

                    <!-- Weekday Section -->
                    <div class="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <span
                            class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Entre
                            semana</span>
                    </div>
                    <button v-for="day in weekdays" :key="day" @click="selectDay(day)"
                        class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-2 capitalize"
                        :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium': selectedDay === day }">
                        <span class="w-3 h-3 rounded-full shrink-0"
                            :style="{ backgroundColor: getDayColor(day) }"></span>
                        {{ day }}
                    </button>

                    <!-- Weekend Section -->
                    <div
                        class="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-700">
                        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fin
                            de semana</span>
                    </div>
                    <button v-for="day in weekendDays" :key="day" @click="selectDay(day)"
                        class="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-2 capitalize"
                        :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium': selectedDay === day }">
                        <span class="w-3 h-3 rounded-full shrink-0"
                            :style="{ backgroundColor: getDayColor(day) }"></span>
                        {{ day }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Search View Overlay -->
        <div v-if="showSearch" class="absolute inset-0 bg-white dark:bg-gray-900 z-40 flex flex-col">
            <!-- Search Header (sticky) -->
            <div
                class="px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Buscar Tianguis</h2>
                    <button @click="showSearch = false"
                        class="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="relative mb-3">
                    <input type="text" v-model="searchQuery" placeholder="Buscar por nombre, calle, municipio..."
                        class="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <!-- Use my location button -->
                <button @click="findNearby" :disabled="isLoadingLocation"
                    class="w-full py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" :class="{ 'animate-pulse': isLoadingLocation }" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ isLoadingLocation ? 'Buscando ubicación...' : 'Usar mi ubicación' }}
                </button>

                <!-- Error message -->
                <div v-if="errorMessage"
                    class="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {{ errorMessage }}
                </div>
            </div>

            <!-- Results Section (scrollable) -->
            <div class="flex-1 overflow-y-auto">
                <div v-if="searchFilteredTianguis.length > 0" class="p-4">
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {{ resultsTitle }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ searchFilteredTianguis.length }} tianguis encontrados
                        </p>
                    </div>

                    <div class="flex flex-col gap-4">
                        <TianguisCard v-for="tianguis in searchFilteredTianguis"
                            :key="`${tianguis.name}-${tianguis.day}`" :tianguis="tianguis"
                            :on-map-click="handleTianguisClick" />
                    </div>
                </div>

                <div v-else class="p-12 text-center">
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">
                        {{ searchQuery ? 'No se encontraron tianguis' : 'Busca tianguis cerca de ti o por nombre' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Map Container -->
        <div class="flex-1 relative">
            <mgl-map :map-style="style" :center="mapCenter" :zoom="mapZoom" height="100%" @map:load="onMapLoad">
                <mgl-navigation-control position="top-right" />
                <mgl-geolocate-control position="top-right" @geolocate="onGeolocate" />

                <!-- Markers for each tianguis -->
                <mgl-marker v-for="tianguis in displayedTianguis"
                    :key="`${tianguis.name}-${tianguis.lat}-${tianguis.lng}`"
                    :coordinates="[tianguis.lng, tianguis.lat]" :color="getMarkerColor(tianguis.day)">
                    <mgl-popup :offset="25">
                        <TianguisPopup :tianguis="tianguis" />
                    </mgl-popup>
                </mgl-marker>
            </mgl-map>

            <!-- Floating action button - Center on user -->
            <button @click="centerOnUser"
                class="absolute bottom-6 right-4 flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-blue-500 dark:text-blue-400 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:text-gray-400 dark:disabled:text-gray-500 active:not-disabled:scale-95 active:not-disabled:bg-blue-50 dark:active:not-disabled:bg-gray-700"
                :disabled="!userLocation">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { MglMap, MglNavigationControl, MglGeolocateControl, MglMarker, MglPopup } from '@indoorequal/vue-maplibre-gl';
import TianguisPopup from '../map/TianguisPopup.vue';
import TianguisCard from '../tianguis/TianguisCard.vue';
import DarkModeToggle from './DarkModeToggle.vue';
import { getMarkerColor } from '../../utils/mapUtils';
import { normalizeForSearch } from '../../utils/text';
import { getUserLocation, calculateDistance } from '../../utils/geolocation';
import type { Tianguis, DayOfWeek, TianguisWithDistance } from '../../types/tianguis';

// Disable automatic attribute inheritance
defineOptions({
    inheritAttrs: false
});

// Props
const props = withDefaults(defineProps<{
    tianguis: Tianguis[];
}>(), {
    tianguis: () => []
});

// State for filters
const selectedMunicipality = ref('Todos');
const selectedDay = ref('Todos');
const showMunicipalityDropdown = ref(false);
const showDayDropdown = ref(false);
const showSearch = ref(false);
const searchQuery = ref('');
const isLoadingLocation = ref(false);
const errorMessage = ref('');

// Filter options
const municipalities = ['Todos', 'Guadalajara', 'Zapopan'];
const weekdays = ['lunes', 'martes', 'miércoles', 'jueves'];
const weekendDays = ['viernes', 'sábado', 'domingo'];

// Helper function to map Spanish day name to DayOfWeek type and get color
const getDayColor = (day: string): string => {
    // Map Spanish accented names to DayOfWeek type
    const dayMap: Record<string, DayOfWeek> = {
        'lunes': 'lunes',
        'martes': 'martes',
        'miércoles': 'miercoles',
        'jueves': 'jueves',
        'viernes': 'viernes',
        'sábado': 'sabado',
        'domingo': 'domingo',
    };

    const mappedDay = dayMap[day];
    return mappedDay ? getMarkerColor(mappedDay) : '#a78bfa';
};

// Map state
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const mapCenter = ref<[number, number]>([-103.3496, 20.6597]); // Guadalajara default
const mapZoom = ref(12);
const mapInstance = ref<any>(null);

// Dark mode detection
const isDarkMode = ref(false);

// Computed map style
const style = computed(() =>
    isDarkMode.value
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
);

// Filter tianguis based on selections (for map display)
const displayedTianguis = computed(() => {
    let filtered = props.tianguis;

    // Filter by municipality
    if (selectedMunicipality.value !== 'Todos') {
        filtered = filtered.filter(t => 
            t.municipality.toLowerCase() === selectedMunicipality.value.toLowerCase()
        );
    }

    // Filter by day
    if (selectedDay.value !== 'Todos') {
        // Map Spanish accented names to DayOfWeek type for comparison
        const dayMap: Record<string, DayOfWeek> = {
            'lunes': 'lunes',
            'martes': 'martes',
            'miércoles': 'miercoles',
            'jueves': 'jueves',
            'viernes': 'viernes',
            'sábado': 'sabado',
            'domingo': 'domingo',
        };
        
        const selectedDayMapped = dayMap[selectedDay.value];
        if (selectedDayMapped) {
            filtered = filtered.filter(t => t.day === selectedDayMapped);
        }
    }

    return filtered;
});

// Filter tianguis for search results
const searchFilteredTianguis = computed(() => {
    let results: TianguisWithDistance[] = props.tianguis.map(t => ({
        ...t,
        distance: (t as TianguisWithDistance).distance
    }));

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

    // Sort by distance if available
    if (results.some((t) => t.distance !== undefined)) {
        results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return results;
});

const resultsTitle = computed(() => {
    if (userLocation.value) {
        return 'Tianguis cerca de ti';
    }
    if (searchQuery.value) {
        return 'Resultados de búsqueda';
    }
    return 'Busca tianguis por nombre o ubicación';
});

// Toggle dropdowns
const toggleMunicipalityDropdown = () => {
    showMunicipalityDropdown.value = !showMunicipalityDropdown.value;
    showDayDropdown.value = false;
};

const toggleDayDropdown = () => {
    showDayDropdown.value = !showDayDropdown.value;
    showMunicipalityDropdown.value = false;
};

// Select filters
const selectMunicipality = (municipality: string) => {
    selectedMunicipality.value = municipality;
    showMunicipalityDropdown.value = false;
};

const selectDay = (day: string) => {
    selectedDay.value = day;
    showDayDropdown.value = false;
};

// Map events
const onMapLoad = (event: any) => {
    console.log('Map loaded');
    mapInstance.value = event.map;
};

const onGeolocate = (event: any) => {
    if (event.coords) {
        userLocation.value = {
            lat: event.coords.latitude,
            lng: event.coords.longitude
        };
    }
};

const centerOnUser = () => {
    if (userLocation.value) {
        mapCenter.value = [userLocation.value.lng, userLocation.value.lat];
        mapZoom.value = 14;
    }
};

// Find nearby tianguis
async function findNearby() {
    isLoadingLocation.value = true;
    errorMessage.value = '';

    try {
        const location = await getUserLocation();
        userLocation.value = location;

        // Calculate distances for all tianguis and update the props
        const tianguisWithDistances = props.tianguis.map((tianguis) => ({
            ...tianguis,
            distance: calculateDistance(location, { lat: tianguis.lat, lng: tianguis.lng }),
        }));

        // Force reactivity by clearing and setting search query
        const temp = searchQuery.value;
        searchQuery.value = '';
        searchQuery.value = temp || ' ';
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Error al obtener ubicación';
    } finally {
        isLoadingLocation.value = false;
    }
}

// Handle tianguis card click - fly to location
const handleTianguisClick = (tianguis: TianguisWithDistance) => {
    // Close search overlay
    showSearch.value = false;
    
    // Fly to the tianguis location
    if (mapInstance.value) {
        mapInstance.value.flyTo({
            center: [tianguis.lng, tianguis.lat],
            zoom: 16,
            duration: 1500,
            essential: true
        });
    } else {
        // Fallback if map not loaded yet
        mapCenter.value = [tianguis.lng, tianguis.lat];
        mapZoom.value = 16;
    }
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-filters')) {
        showMunicipalityDropdown.value = false;
        showDayDropdown.value = false;
    }
};

// Dark mode detection
const updateDarkMode = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark');
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    updateDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
        observer.disconnect();
    });
});
</script>

<style scoped>
.mobile-map-view {
    position: relative;
    overflow: hidden;
}

.header-filters {
    position: relative;
}
</style>
