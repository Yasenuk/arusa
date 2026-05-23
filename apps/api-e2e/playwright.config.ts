import { defineConfig } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['API_BASE_URL'] || 'http://localhost:3333';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  use: {
    baseURL,
  },
  webServer: {
    command: 'node --env-file=.env apps/api/dist/main.js',
    url: `${baseURL}/api/categories`,
    reuseExistingServer: true,
    cwd: workspaceRoot,
    timeout: 30000,
  },
  // Run tests serially to avoid test user conflicts
  workers: 1,
});
