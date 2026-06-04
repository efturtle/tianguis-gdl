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
        <div v-if="showSearch" class="absolute inset-0 bg-white dark:bg-gray-900 z-40 overflow-y-auto">
            <div
                class="px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
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
                <div class="relative">
                    <input type="text" v-model="searchQuery" placeholder="Buscar por nombre, calle, municipio..."
                        class="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <div class="px-4 py-6">
                <p class="text-center text-gray-500 dark:text-gray-400">
                    Función de búsqueda próximamente...
                </p>
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
import DarkModeToggle from './DarkModeToggle.vue';
import { getMarkerColor } from '../../utils/mapUtils';
import type { Tianguis, DayOfWeek } from '../../types/tianguis';

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

// Dark mode detection
const isDarkMode = ref(false);

// Computed map style
const style = computed(() =>
    isDarkMode.value
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
);

// Filter tianguis based on selections
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
const onMapLoad = () => {
    console.log('Map loaded');
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
