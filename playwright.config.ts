import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',
  reporter: [
    ['line'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    browserName: 'chromium',
  },
});
