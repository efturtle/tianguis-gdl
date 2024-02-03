<template>
    <input 
        class="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        type="text"
        :placeholder="placeholder" >
</template>

<script setup lang="ts">
    import { defineProps } from 'vue';
    const props = defineProps({
        placeholder: String
    });
</script>