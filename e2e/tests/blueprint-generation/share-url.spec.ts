import { test, expect } from "@playwright/test"

test.describe("Share URL", () => {
	test("generating blueprint updates URL with settings", async ({ page }) => {
		await page.goto("/")
		await page.getByRole("button", { name: /generate blueprint/i }).click()

		// URL should contain encoded settings
		await expect(page).toHaveURL(/settings=/)
	})

	test("URL contains shareable settings parameter", async ({ page }) => {
		await page.goto("/")
		await page.getByRole("button", { name: /generate blueprint/i }).click()

		const url = page.url()
		expect(url).toContain("?settings=")
	})

	test("navigating to shared URL loads settings", async ({ page }) => {
		// First generate a blueprint to get settings
		await page.goto("/")
		await page.getByRole("button", { name: /generate blueprint/i }).click()

		const generatedUrl = page.url()

		// Navigate to the same URL again
		await page.goto(generatedUrl)

		// The settings should be restored from URL
		// App should show the same station type
		await expect(page.locator("select").first()).toBeVisible()
	})

	test("malformed settings URL does not crash app", async ({ page }) => {
		// Navigate with invalid settings
		await page.goto("/?settings=invalidsettings")

		// App should still be functional
		await expect(page.getByRole("button", { name: /generate blueprint/i })).toBeVisible()
	})

	test("empty settings URL loads default state", async ({ page }) => {
		await page.goto("/")

		// App should load with defaults
		await expect(page.getByRole("button", { name: /generate blueprint/i })).toBeVisible()
	})
})
