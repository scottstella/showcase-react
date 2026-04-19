import { expect, test } from "@playwright/test";
import { mockSupabaseTable } from "./helpers/supabaseRouteMocks";

test.describe("Tribes Management E2E", () => {
  test("loads tribes and validates empty submit", async ({ page }) => {
    await mockSupabaseTable(page, "tribe", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" },
            { id: 2, name: "Dragon", created_at: "2024-01-02T11:00:00Z" },
          ]),
        });
      },
      post: async route => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 3, name: "New Tribe", created_at: "2024-01-03T12:00:00Z" }),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator("text=Beast")).toBeVisible();
    await page.click('input[type="submit"]');
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("adds tribe successfully", async ({ page }) => {
    const tribes = [{ id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" }];

    await mockSupabaseTable(page, "tribe", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(tribes),
        });
      },
      post: async route => {
        tribes.push({ id: 2, name: "Mech", created_at: "2024-01-04T12:00:00Z" });
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(tribes[1]),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();
    await page.fill('input[placeholder="Name"]', "Mech");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");
    await expect(page.locator("text=Mech")).toBeVisible();
    await expect(page.locator('input[placeholder="Name"]')).toHaveValue("");
  });

  test("shows GET error as toast", async ({ page }) => {
    await mockSupabaseTable(page, "tribe", {
      get: async route => {
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
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await expect(page.locator(".Toastify__toast--error")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".Toastify__toast--error")).toContainText("Error:");
  });

  test("shows auth-required message for add and delete", async ({ page }) => {
    await mockSupabaseTable(page, "tribe", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" }]),
        });
      },
      post: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      },
      del: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#tribes").click();

    await page.fill('input[placeholder="Name"]', "Mech");
    await page.click('input[type="submit"]');
    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");

    await page.click('[data-testid="delete-tribe"]');
    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");
  });
});
