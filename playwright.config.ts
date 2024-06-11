import { defineConfig, devices } from "@playwright/test"
import type { TestOptions } from "./test-options"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 10,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:4200',
    baseURL: process.env.DEV ? 'http://the.dev.env.com'
     : process.env.STAGING ? 'http://the.staging.env.com' 
     : 'http://localhost:4200',

    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry", //['on-first-retry', 'on-all-retries', 'off', 'on', 'retain-on-failure']
    // actionTimeout: 5000,
    // navigationTimeout: 5000,
    video: 'on-first-retry',
    // video: {
    //   mode: "on",
    //   size: { width: 1920, height: 1080 },
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Dev",
      use: {
        ...devices["Desktop Chrome"],
        // baseURL: 'http://the.dev.env.com',        
      },
    },
    {
      name: "Staging",
      use: {
        ...devices["Desktop Chrome"],
        // baseURL: 'http://the.staging.env.com',        
      },
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
