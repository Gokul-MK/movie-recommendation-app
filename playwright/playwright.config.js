// @ts-check
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
    testDir: './e2e',
    timeout: 60000,
    retries: 1,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
})
