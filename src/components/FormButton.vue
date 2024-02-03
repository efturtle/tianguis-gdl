<template>
    <button class="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {{ value }}
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
    value: String
});
</script>