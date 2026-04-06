import { test, expect } from "@playwright/test"

test.describe("Belt and Inserter Settings", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		// Select Unloading Station to see belt/inserter settings
		await page.locator("select").first().selectOption("Unloading Station")
	})

	test("belt settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/belt/i)
	})

	test("can interact with belt settings", async ({ page }) => {
		const selects = page.locator("select")
		const count = await selects.count()
		expect(count).toBeGreaterThan(0)
	})

	test("inserter settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/inserter/i)
	})

	test("stack size options are available", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/stack/i)
	})
})
