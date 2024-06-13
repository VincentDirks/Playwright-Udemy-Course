import { defineConfig, devices } from "@playwright/test"
import type { TestOptions } from "./test-options"
import { start } from "repl"

require("dotenv").config()

export default defineConfig<TestOptions>({
  expect: {
    // toMatchSnapshot: { maxDiffPixels: 50 },
  },
  retries: 1,
  reporter: [
    ["json", { outputFile: "test-results/jsonReport.json" }],
    ["junit", { outputFile: "test-results/junitReport.xml" }],
    // ["allure-playwright"],
    ["html"],
  ],

  use: {
    baseURL: "http://localhost:4200",
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",

    trace: "on-first-retry",
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: "on-first-retry",
  },

  projects: [
    {
      name: "Dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://the.dev.env.com",
      },
    },

    { name: "chromium" },

    {
      name: "firefox",
      use: { browserName: "firefox" },
    },
    {
      name: "pageObjectFullScreen",
      testMatch: "usePageObjects.spec.ts",
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "mobile",
      testMatch: "testMobile.spec.ts",
      use: {
        ...devices["iPhone 13 Pro"],
        // viewport: { width: 414, height: 800 },
      },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
})