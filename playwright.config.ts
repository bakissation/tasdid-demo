import { defineConfig, devices } from '@playwright/test';

/**
 * E2E against the running stack (app + redis + satim-mock), exactly as `docker
 * compose up` brings it up. The suite drives our own payment page — whose
 * selectors intentionally don't match real SATIM — so it passes here and would
 * fail against the real gateway. That is by design: SATIM forbids botting.
 */
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
