import { test, expect } from "@playwright/test";

test.describe("Tribes Management E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set up basic mocking for Supabase requests
    await page.route("**/rest/v1/tribe*", async route => {
      const method = route.request().method();

      if (method === "GET") {
        // Return mock tribes data
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" },
            { id: 2, name: "Dragon", created_at: "2024-01-02T11:00:00Z" },
          ]),
        });
      } else if (method === "POST") {
        // Return success for POST requests
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 3, name: "New Tribe", created_at: "2024-01-03T12:00:00Z" }),
        });
      } else if (method === "DELETE") {
        // Return success for DELETE requests
        await route.fulfill({
          status: 204,
          body: "",
        });
      }
    });
  });

  test("should navigate to Tribes page correctly", async ({ page }) => {
    await page.goto("/");

    // Click on Admin section to expand it
    await page.click("text=Admin");

    // Click on Manage Meta-Data
    await page.click("text=Manage Meta-Data");

    // Click on Tribes tab
    await page.click("text=Tribes");

    // Verify we're on the tribes page
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
    await expect(page.locator('input[type="submit"]')).toBeVisible();

    // Wait for the table to load and verify mock data is displayed
    await expect(page.locator("text=Beast")).toBeVisible();
    await expect(page.locator("text=Dragon")).toBeVisible();
  });

  test("should show validation error when submitting empty form", async ({ page }) => {
    await page.goto("/manageMetaData");
    await page.click("text=Tribes");

    // Wait for the form to be visible
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    // Try to submit empty form
    await page.click('input[type="submit"]');

    // Verify validation error is shown
    await expect(page.locator(".error-msg")).toBeVisible();
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("should show validation error when submitting form with only whitespace", async ({
    page,
  }) => {
    await page.goto("/manageMetaData");
    await page.click("text=Tribes");

    // Wait for the form to be visible
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    // Enter only whitespace
    await page.fill('input[placeholder="Name"]', "   ");
    await page.click('input[type="submit"]');

    // Verify validation error is shown
    await expect(page.locator(".error-msg")).toBeVisible();
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("should successfully add a tribe", async ({ page }) => {
    await page.goto("/manageMetaData");
    await page.click("text=Tribes");

    // Wait for the form to be visible
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    // Fill the form with a valid tribe name
    await page.fill('input[placeholder="Name"]', "Mech");
    await page.click('input[type="submit"]');

    // Verify success toast is shown
    await expect(page.locator(".Toastify__toast--info")).toBeVisible();
    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");

    // Verify the form is cleared
    await expect(page.locator('input[placeholder="Name"]')).toHaveValue("");
  });

  test("should show loading state while fetching data", async ({ page }) => {
    // Mock a slow response
    await page.route("**/rest/v1/tribe*", async route => {
      if (route.request().method() === "GET") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" }]),
        });
      }
    });

    await page.goto("/manageMetaData");
    await page.click("text=Tribes");

    // Verify loading indicator is shown
    await expect(page.getByText("Loading...")).toBeVisible();

    // Wait for data to load
    await expect(page.locator("text=Beast")).toBeVisible();
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Mock a network error
    await page.route("**/rest/v1/tribe*", async route => {
      if (route.request().method() === "GET") {
        await route.abort("failed");
      }
    });

    await page.goto("/manageMetaData");
    await page.click("text=Tribes");

    // Verify error toast is shown
    await expect(page.locator(".Toastify__toast--error")).toBeVisible();
  });
});
