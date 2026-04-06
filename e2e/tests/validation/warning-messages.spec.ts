import { test, expect } from "@playwright/test"

test.describe("Warning Messages", () => {
	test("no warning message on default settings", async ({ page }) => {
		await page.goto("/")

		// Warning container should be hidden or empty with default settings
		await expect(page.locator(".bg-yellow")).toBeHidden()
	})

	test("app remains functional regardless of warning state", async ({ page }) => {
		await page.goto("/")

		// The app should be functional
		await expect(page.getByRole("button", { name: /generate blueprint/i })).toBeVisible()
	})
})
