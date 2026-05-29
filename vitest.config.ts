import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    // This tells Vitest to simulate a browser DOM so Vue can mount the HTML
    environment: 'jsdom',
    
    // Optional but recommended: include both standard tests and type tests
    include: ['src/**/*.test.ts', 'src/**/*.test-d.ts'],
  },
});