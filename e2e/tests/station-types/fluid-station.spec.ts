import { test, expect } from "@playwright/test"

test.describe("Fluid Station", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		// Select Fluid Station
		await page.locator("select").first().selectOption("Fluid Loading Station")
	})

	test("displays fluid loading station settings", async ({ page }) => {
		await expect(page.getByLabel(/fluid/i)).toBeVisible()
	})

	test("can switch between fluid loading and fluid unloading station", async ({ page }) => {
		const selector = page.locator("select").first()

		await selector.selectOption("Fluid Loading Station")
		await expect(selector).toHaveValue("Fluid Loading Station")

		await selector.selectOption("Fluid Unloading Station")
		await expect(selector).toHaveValue("Fluid Unloading Station")
	})

	test("train type dropdown works", async ({ page }) => {
		const trainTypeSelector = page.locator("select").nth(1)
		await expect(trainTypeSelector).toBeVisible()
	})

	test("has fluid-specific settings visible", async ({ page }) => {
		// Check that fluid-related settings appear
		await expect(page.locator("body")).toContainText(/fluid/i)
	})
})
