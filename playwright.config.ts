import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	webServer: {
		command: "npm run build && npx serve -s build -p 3001",
		port: 3001,
		timeout: 120 * 1000,
	},
	use: {
		baseURL: "http://localhost:3001",
	},
	testDir: "e2e/tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? "github" : "list",
	projects: [
		// Desktop browsers
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "safari",
			use: { ...devices["Desktop Safari"] },
		},
		// Mobile devices
		{
			name: "iphone",
			use: { ...devices["iPhone 13"] },
		},
		{
			name: "pixel",
			use: { ...devices["Pixel 5"] },
		},
	],
})
