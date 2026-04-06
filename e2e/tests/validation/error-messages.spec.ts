import { test, expect } from "@playwright/test"

test.describe("Error Messages", () => {
	test("no error message on valid default settings", async ({ page }) => {
		await page.goto("/")

		// Error container should be hidden with default settings
		const errorElements = page.locator(".bg-red, [class*='error']")
		// If any exist, they should be hidden
		const count = await errorElements.count()
		if (count > 0) {
			await expect(errorElements.first()).toBeHidden()
		}
	})

	test("generate button is enabled with valid settings", async ({ page }) => {
		await page.goto("/")

		const generateButton = page.getByRole("button", { name: /generate blueprint/i })
		await expect(generateButton).toBeEnabled()
	})

	test("blueprint generates successfully with valid settings", async ({ page }) => {
		await page.goto("/")

		await page.getByRole("button", { name: /generate blueprint/i }).click()

		// Blueprint should be generated - check for readonly inputs appearing
		const readonlyInputs = page.locator("input[readonly]")
		await expect(readonlyInputs.first()).toBeVisible()
	})
})
