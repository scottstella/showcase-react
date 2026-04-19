import { expect, test } from "@playwright/test";
import { mockSupabaseTable } from "./helpers/supabaseRouteMocks";

test.describe("Hero Classes Management E2E", () => {
  test("renders classes and validates empty submit", async ({ page }) => {
    await mockSupabaseTable(page, "hero_class", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: 1, name: "Mage", created_at: "2024-01-01T10:00:00Z" }]),
        });
      },
      post: async route => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 2, name: "Priest", created_at: "2024-01-03T12:00:00Z" }),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#classes").click();

    await expect(page.locator("text=Mage")).toBeVisible();
    await page.click('input[type="submit"]');
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("adds and deletes class with success toasts", async ({ page }) => {
    const rows = [{ id: 1, name: "Mage", created_at: "2024-01-01T10:00:00Z" }];

    await mockSupabaseTable(page, "hero_class", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(rows),
        });
      },
      post: async route => {
        rows.push({ id: 2, name: "Priest", created_at: "2024-01-02T11:00:00Z" });
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(rows[1]),
        });
      },
      del: async route => {
        rows.shift();
        await route.fulfill({ status: 204, body: "" });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#classes").click();

    await page.fill('input[placeholder="Name"]', "Priest");
    await page.click('input[type="submit"]');
    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");
    await expect(page.locator("text=Priest")).toBeVisible();

    await page.locator("tbody tr").first().locator("svg").click();
    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");
  });

  test("shows auth-required error when add is blocked by RLS", async ({ page }) => {
    await mockSupabaseTable(page, "hero_class", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: 1, name: "Mage", created_at: "2024-01-01T10:00:00Z" }]),
        });
      },
      post: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#classes").click();
    await page.fill('input[placeholder="Name"]', "Priest");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");
  });
});
