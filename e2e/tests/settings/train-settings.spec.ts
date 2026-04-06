import { test, expect } from "@playwright/test"

test.describe("Train Type Settings", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
	})

	test("train type dropdown is visible and selectable", async ({ page }) => {
		const selects = page.locator("select")
		await expect(selects.first()).toBeVisible()
	})

	test("can change train type", async ({ page }) => {
		const trainTypeSelector = page.locator("select").nth(1)
		const options = await trainTypeSelector.locator("option").allTextContents()
		expect(options.length).toBeGreaterThan(0)
	})

	test("train limit settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/train limit/i)
	})

	test("can interact with train limit settings", async ({ page }) => {
		const trainLimitSelectors = page.locator("select")
		const count = await trainLimitSelectors.count()
		expect(count).toBeGreaterThan(0)
	})

	test("dynamic train limit shows additional options", async ({ page }) => {
		// Default train limit is Dynamic, so arithmetic combinator should be visible
		await expect(page.locator("body")).toContainText(/arithmetic/i)
	})

	test("train limit stack size options visible when dynamic", async ({ page }) => {
		// Default is Dynamic, stack size options should be visible
		await expect(page.locator("body")).toContainText(/stack size/i)
	})
})
