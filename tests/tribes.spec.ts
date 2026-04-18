import { test, expect, type Route } from "@playwright/test";

/** CORS preflight for browser → Supabase cross-origin fetch */
async function fulfillCorsPreflight(route: Route): Promise<void> {
  await route.fulfill({
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, prefer, accept-profile, range, x-supabase-api-version",
      "Access-Control-Max-Age": "86400",
    },
  });
}

test.describe("Tribes Management E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/rest/v1/tribe*", async route => {
      const method = route.request().method();

      if (method === "OPTIONS") {
        await fulfillCorsPreflight(route);
        return;
      }

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" },
            { id: 2, name: "Dragon", created_at: "2024-01-02T11:00:00Z" },
          ]),
        });
        return;
      }

      if (method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 3, name: "New Tribe", created_at: "2024-01-03T12:00:00Z" }),
        });
        return;
      }

      if (method === "DELETE") {
        await route.fulfill({
          status: 204,
          body: "",
        });
        return;
      }

      await route.fallback();
    });
  });

  test("should navigate to Tribes page correctly", async ({ page }) => {
    await page.goto("/");

    await page.locator(".nav").getByText("Admin").click();
    await page.getByRole("link", { name: "Manage Meta-Data" }).click();
    await expect(page).toHaveURL(/\/manageMetaData$/);

    await page.locator("#tribes").click();

    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
    await expect(page.locator('input[type="submit"]')).toBeVisible();

    await expect(page.locator("text=Beast")).toBeVisible();
    await expect(page.locator("text=Dragon")).toBeVisible();
  });

  test("should show validation error when submitting empty form", async ({ page }) => {
    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    await page.click('input[type="submit"]');

    await expect(page.locator(".error-msg")).toBeVisible();
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("should show validation error when submitting form with only whitespace", async ({
    page,
  }) => {
    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    await page.fill('input[placeholder="Name"]', "   ");
    await page.click('input[type="submit"]');

    await expect(page.locator(".error-msg")).toBeVisible();
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("should successfully add a tribe", async ({ page }) => {
    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    await page.fill('input[placeholder="Name"]', "Mech");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--info")).toBeVisible();
    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");

    await expect(page.locator('input[placeholder="Name"]')).toHaveValue("");
  });

  test("should show loading state while fetching data", async ({ page }) => {
    await page.route("**/rest/v1/tribe*", async route => {
      if (route.request().method() === "OPTIONS") {
        await fulfillCorsPreflight(route);
        return;
      }
      if (route.request().method() === "GET") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" }]),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.getByText("Loading...")).toBeVisible();

    await expect(page.locator("text=Beast")).toBeVisible();
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Use an HTTP error body PostgREST-style. `route.abort()` does not always surface
    // the same client error path across browsers as a failed REST response.
    await page.route("**/rest/v1/tribe*", async route => {
      if (route.request().method() === "OPTIONS") {
        await fulfillCorsPreflight(route);
        return;
      }
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            code: "58000",
            details: "Simulated server failure for E2E",
            hint: "",
            message: "Internal server error",
          }),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator(".Toastify__toast--error")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".Toastify__toast--error")).toContainText("Error:");
  });

  test("should require authentication for adding tribes", async ({ page }) => {
    await page.route("**/rest/v1/tribe*", async route => {
      const method = route.request().method();

      if (method === "OPTIONS") {
        await fulfillCorsPreflight(route);
        return;
      }

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" },
            { id: 2, name: "Dragon", created_at: "2024-01-02T11:00:00Z" },
          ]),
        });
        return;
      }

      if (method === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
        return;
      }

      await route.fallback();
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    await page.fill('input[placeholder="Name"]', "Mech");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--error")).toBeVisible();
    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");
  });

  test("should require authentication for deleting tribes", async ({ page }) => {
    await page.route("**/rest/v1/tribe*", async route => {
      const method = route.request().method();

      if (method === "OPTIONS") {
        await fulfillCorsPreflight(route);
        return;
      }

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" },
            { id: 2, name: "Dragon", created_at: "2024-01-02T11:00:00Z" },
          ]),
        });
        return;
      }

      if (method === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
        return;
      }

      await route.fallback();
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator("text=Beast")).toBeVisible();

    await page.click('[data-testid="delete-tribe"]');

    await expect(page.locator(".Toastify__toast--error")).toBeVisible();
    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");
  });
});
