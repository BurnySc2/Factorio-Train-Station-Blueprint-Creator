import { test, expect } from "@playwright/test"

test.describe("Chest Settings", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		// Select Unloading Station to see chest settings
		await page.locator("select").first().selectOption("Unloading Station")
	})

	test("chest settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/chest/i)
	})

	test("can interact with chest settings", async ({ page }) => {
		const selects = page.locator("select")
		const count = await selects.count()
		expect(count).toBeGreaterThan(0)
	})

	test("chest limit options are available", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/limit/i)
	})

	test("green wire options are available", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/wire/i)
	})
})
