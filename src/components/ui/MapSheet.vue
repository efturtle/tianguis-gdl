<template>
    <div class="bottom-sheet bg-white dark:bg-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] rounded-t-3xl"
        :class="{ 'expanded': isSheetExpanded, 'visible': selectedTianguis }" ref="bottomSheet"
        @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <div v-if="selectedTianguis" class="sheet-content px-6 pb-6 overflow-y-auto max-h-[calc(75vh-3rem)]">
            <div class="flex items-center gap-4 cursor-pointer pb-4" @click="toggleSheet">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 pt-2">
                        {{ selectedTianguis.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span
                            class="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded text-xs font-semibold mr-2">
                            {{ getDayLabel(selectedTianguis.day) }}
                        </span>
                        {{ selectedTianguis.municipality }}
                    </p>
                </div>
                <svg class="w-6 h-6 text-gray-400 dark:text-gray-500 transition-transform"
                    :class="{ 'rotate-180': isSheetExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <div v-if="isSheetExpanded" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="mb-5">
                    <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ubicación
                    </h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{
                        formatLocation(selectedTianguis)
                    }}</p>
                </div>

                <div class="mb-5">
                    <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Día de la semana
                    </h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{
                        getDayLabel(selectedTianguis.day) }}</p>
                </div>

                <div class="mb-5">
                    <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Municipio
                    </h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{
                        capitalizeMunicipality(selectedTianguis.municipality) }}</p>
                </div>

                <div v-if="selectedTianguis.distance" class="mb-5">
                    <h4 class="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Distancia
                    </h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-6">{{
                        formatDistance(selectedTianguis.distance) }}</p>
                </div>

                <div class="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button @click="openInGoogleMaps"
                        class="w-full flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 text-white rounded-xl font-medium text-[15px] transition-all active:scale-[0.98] active:bg-blue-700 dark:bg-blue-600 dark:active:bg-blue-700 border-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Abrir en Google Maps
                    </button>

                    <button @click="shareLocation"
                        class="w-full flex items-center justify-center gap-2 py-3 px-5 bg-white dark:bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-xl font-medium text-[15px] transition-all active:scale-[0.98] active:bg-blue-50 dark:active:bg-blue-900/20">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Compartir
                    </button>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button @click="reportIssueUtil(props.selectedTianguis)"
                    class="text-xs text-red-500 hover:text-red-700 dark:text-red-400 flex items-center gap-1 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Reportar error en la información
                </button>
            </div>
        </div>

        <div v-else class="p-8 text-center">
            <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
                Toca un marcador en el mapa para ver más información
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TianguisWithDistance, DayOfWeek } from '../../types/tianguis';
import { formatDistance as formatDist, getUserLocation } from '../../utils/geolocation';
import { ref } from 'vue';
import { reportIssue as reportIssueUtil } from '../../utils/reportIssue';
interface Props {
    selectedTianguis: TianguisWithDistance | null;
}

const isSheetExpanded = ref(false);
const bottomSheet = ref<HTMLElement | null>(null);
const props = defineProps<Props>();

let touchStartY = 0;
const isReporting = ref(false);

// UI Interaction Functions
function toggleSheet() {
    isSheetExpanded.value = !isSheetExpanded.value;
}

function handleTouchStart(event: TouchEvent) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event: TouchEvent) {
    if (!bottomSheet.value) return;
    const touchY = event.touches[0].clientY;
    const deltaY = touchStartY - touchY;

    if (deltaY > 0) {
        isSheetExpanded.value = true;
    } else if (deltaY < -50 && isSheetExpanded.value) {
        isSheetExpanded.value = false;
    }
}

function handleTouchEnd() {
    touchStartY = 0;
}

// Action Handlers
function openInGoogleMaps() {
    if (props.selectedTianguis) {
        // FIXED: Properly formats the Google Maps URL
        const url = `https://www.google.com/maps/search/?api=1&query=${props.selectedTianguis.lat},${props.selectedTianguis.lng}`;
        window.open(url, '_blank');
    }
}

async function shareLocation() {
    if (!props.selectedTianguis) return;

    const shareData = {
        title: props.selectedTianguis.name,
        text: `${props.selectedTianguis.name} - ${formatLocation(props.selectedTianguis)}`,
        url: window.location.href,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            alert('Enlace copiado al portapapeles');
        }
    } catch (error) {
        console.error('Error sharing:', error);
    }
}

// Formatting Utilities
function formatLocation(tianguis: any) {
    if (tianguis.location?.type === 'address') return tianguis.location.direccion;
    if (tianguis.location?.type === 'streets') return `${tianguis.location.street1} / ${tianguis.location.street2}`;
    return 'Ubicación no disponible';
}

function getDayLabel(day: DayOfWeek): string {
    const days: Record<DayOfWeek, string> = {
        lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
        jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
    };
    return days[day] || day;
}

function capitalizeMunicipality(municipality: string): string {
    return municipality.charAt(0).toUpperCase() + municipality.slice(1);
}

function formatDistance(km: number): string {
    return formatDist(km);
}

</script>