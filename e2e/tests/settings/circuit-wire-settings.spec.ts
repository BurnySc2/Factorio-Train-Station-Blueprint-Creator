import { test, expect } from "@playwright/test"

test.describe("Circuit and Wire Settings", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
	})

	test("wire settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/wire/i)
	})

	test("lamp settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/lamp/i)
	})

	test("enabled condition settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/enabled/i)
	})

	test("refill settings are visible", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/refill/i)
	})

	test("station name settings are visible", async ({ page }) => {
		await expect(page.getByPlaceholder(/station name/i)).toBeVisible()
	})
})
