<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue';
</script>

<template>

  <header>
    <TheNavbar />
  </header>

  <main class="p-8 md:p-16">
    <RouterView />
  </main>
</template>