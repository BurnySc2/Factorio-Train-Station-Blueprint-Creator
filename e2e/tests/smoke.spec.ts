import { test, expect } from "@playwright/test"

/**
 * Smoke test - verifies the app loads and all main elements are visible.
 * This is a sanity check that runs first to ensure the app is functional.
 */
test.describe("Smoke Tests", () => {
	test("page loads without errors", async ({ page }) => {
		// Collect console errors
		const consoleErrors: string[] = []
		page.on("console", (msg) => {
			if (msg.type() === "error") {
				consoleErrors.push(msg.text())
			}
		})

		await page.goto("/")

		// Wait for the page to fully load
		await page.waitForLoadState("networkidle")

		// Check no console errors
		expect(consoleErrors).toHaveLength(0)
	})

	test("title is visible", async ({ page }) => {
		await page.goto("/")
		await expect(page.getByText("Burny's Train Station Blueprint Creator")).toBeVisible()
	})

	test("station type selector is visible", async ({ page }) => {
		await page.goto("/")
		const selector = page.locator("select").first()
		await expect(selector).toBeVisible()
	})

	test("generate blueprint button is visible", async ({ page }) => {
		await page.goto("/")
		await expect(page.getByRole("button", { name: /generate blueprint/i })).toBeVisible()
	})
})
