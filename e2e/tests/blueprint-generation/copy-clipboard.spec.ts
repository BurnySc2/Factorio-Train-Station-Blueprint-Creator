import { test, expect } from "@playwright/test"

test.describe("Copy to Clipboard", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		// Generate a blueprint first
		await page.getByRole("button", { name: /generate blueprint/i }).click()
	})

	test("copy to clipboard button appears after generation", async ({ page }) => {
		await expect(page.getByRole("button", { name: /copy to clipboard/i })).toBeVisible()
	})

	test("copy shareable link button appears after generation", async ({ page }) => {
		await expect(page.getByRole("button", { name: /copy shareable link/i })).toBeVisible()
	})

	test("copy buttons are hidden before generation", async ({ page }) => {
		// Reload to reset state
		await page.reload()

		// Copy buttons should be hidden initially
		const copyButton = page.getByRole("button", { name: /copy to clipboard/i })
		await expect(copyButton).toBeHidden()
	})
})
