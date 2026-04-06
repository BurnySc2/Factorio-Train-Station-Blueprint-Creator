import { test, expect } from "@playwright/test"

test.describe("Blueprint Generation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
	})

	test("generate button is visible", async ({ page }) => {
		await expect(page.getByRole("button", { name: /generate blueprint/i })).toBeVisible()
	})

	test("generates blueprint for default settings", async ({ page }) => {
		const generateButton = page.getByRole("button", { name: /generate blueprint/i })
		await generateButton.click()

		// Blueprint string input should appear
		const blueprintInput = page.locator("input[readonly]").last()
		await expect(blueprintInput).toBeVisible()
	})

	test("blueprint length is shown after generation", async ({ page }) => {
		const generateButton = page.getByRole("button", { name: /generate blueprint/i })
		await generateButton.click()

		// Blueprint length should be visible in readonly input
		await expect(page.locator('input[value*="Blueprint length"]')).toBeVisible()
	})

	test("changing settings then regenerating works", async ({ page }) => {
		// Generate first blueprint
		await page.getByRole("button", { name: /generate blueprint/i }).click()
		await expect(page.locator("input[readonly]").last()).toBeVisible()

		// Change station type
		await page.locator("select").first().selectOption("Stacker")

		// Generate again
		await page.getByRole("button", { name: /generate blueprint/i }).click()
		await expect(page.locator("input[readonly]").last()).toBeVisible()
	})

	test("URL is updated after generation", async ({ page }) => {
		await page.getByRole("button", { name: /generate blueprint/i }).click()

		// URL should contain settings parameter
		await expect(page).toHaveURL(/settings=/)
	})
})
