<template>
  <button
    @click="toggleDarkMode"
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
  >
    <!-- Sun icon for light mode -->
    <svg
      v-if="isDark"
      class="w-5 h-5 text-yellow-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- Moon icon for dark mode -->
    <svg
      v-else
      class="w-5 h-5 text-gray-700"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

function toggleDarkMode() {
  isDark.value = !isDark.value;
  updateDarkMode();
}

function updateDarkMode() {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
}

function initializeDarkMode() {
  // First check if dark class is already on the document (set by inline script)
  const hasExistingDarkClass = document.documentElement.classList.contains('dark');
  
  if (hasExistingDarkClass) {
    isDark.value = true;
  } else {
    // Check localStorage
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      isDark.value = savedMode === 'true';
      // Apply the mode if it wasn't already applied
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      }
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }
}

onMounted(() => {
  initializeDarkMode();
});
</script>
