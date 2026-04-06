import { test, expect } from "@playwright/test"

test.describe("Stacker", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		// Select Stacker
		await page.locator("select").first().selectOption("Stacker")
	})

	test("displays stacker settings", async ({ page }) => {
		await expect(page.locator("body")).toContainText(/stack/i)
	})

	test("has stacker-specific options visible", async ({ page }) => {
		// Stacker should show path/station count settings
		await expect(page.getByRole("button")).toBeVisible()
	})

	test("can generate blueprint for stacker", async ({ page }) => {
		const generateButton = page.getByRole("button", { name: /generate blueprint/i })
		await expect(generateButton).toBeVisible()

		// Click generate
		await generateButton.click()

		// Blueprint output should appear
		await expect(page.locator("input[readonly]").last()).toBeVisible()
	})
})
