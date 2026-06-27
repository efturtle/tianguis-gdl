import { defineConfig } from 'vitest/config';
import { defineConfig as defineViteConfig, type PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
  plugins: [vue() as PluginOption, visualizer() as PluginOption],
  test: {
    // This tells Vitest to simulate a browser DOM so Vue can mount the HTML
    environment: 'jsdom',
    
    // Optional but recommended: include both standard tests and type tests
    include: ['src/**/*.test.ts', 'src/**/*.test-d.ts'],
  },
});