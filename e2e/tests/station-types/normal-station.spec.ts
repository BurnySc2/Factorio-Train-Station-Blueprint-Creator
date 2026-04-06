import { test, expect } from "@playwright/test"

test.describe("Normal Station", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		// Select Normal Station
		await page.locator("select").first().selectOption("Loading Station")
	})

	test("displays loading station settings", async ({ page }) => {
		// Should show station-specific options
		await expect(page.locator("body")).toContainText(/train/i)
	})

	test("can switch between loading and unloading station", async ({ page }) => {
		const selector = page.locator("select").first()

		await selector.selectOption("Loading Station")
		await expect(selector).toHaveValue("Loading Station")

		await selector.selectOption("Unloading Station")
		await expect(selector).toHaveValue("Unloading Station")
	})

	test("train type dropdown works", async ({ page }) => {
		const selects = page.locator("select")
		await expect(selects.nth(1)).toBeVisible()
	})

	test("chest settings visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/chest/i)
	})

	test("belt settings visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/belt/i)
	})

	test("inserter settings visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/inserter/i)
	})
})
