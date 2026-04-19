import { expect, test } from "@playwright/test";
import { mockSupabaseTable } from "./helpers/supabaseRouteMocks";

test.describe("Sets Management E2E", () => {
  test("renders set rows and validates empty name", async ({ page }) => {
    await mockSupabaseTable(page, "set", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              name: "Core",
              created_at: "2024-01-01T10:00:00Z",
              is_standard: true,
              release_date: "2024-01-01",
            },
          ]),
        });
      },
      post: async route => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: 2,
            name: "Whizbang",
            created_at: "2024-01-02T10:00:00Z",
            is_standard: false,
            release_date: "2024-04-09",
          }),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#sets").click();

    await expect(page.locator("text=Core")).toBeVisible();
    await expect(page.getByText("Yes")).toBeVisible();

    await page.fill('input[placeholder="Name"]', "");
    await page.click('input[type="submit"]');
    await expect(page.locator(".error-msg")).toContainText("Name is required");
  });

  test("adds set and resets the set form", async ({ page }) => {
    const rows = [
      {
        id: 1,
        name: "Core",
        created_at: "2024-01-01T10:00:00Z",
        is_standard: true,
        release_date: "2024-01-01",
      },
    ];

    await mockSupabaseTable(page, "set", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(rows),
        });
      },
      post: async route => {
        rows.push({
          id: 2,
          name: "Whizbang",
          created_at: "2024-04-09T10:00:00Z",
          is_standard: false,
          release_date: "2024-04-09",
        });
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(rows[1]),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

    await page.goto("/manageMetaData");
    await page.locator("#sets").click();

    await page.fill('input[placeholder="Name"]', "Whizbang");
    await page.locator("#is_standard").uncheck();
    await page.fill("#release_date", "2024-04-09");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");
    await expect(page.locator("text=Whizbang")).toBeVisible();
    await expect(page.locator('input[placeholder="Name"]')).toHaveValue("");
  });

  test("shows auth-required error when set delete is blocked", async ({ page }) => {
    await mockSupabaseTable(page, "set", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              name: "Core",
              created_at: "2024-01-01T10:00:00Z",
              is_standard: true,
              release_date: "2024-01-01",
            },
          ]),
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
    await page.locator("#sets").click();
    await page.click('[data-testid="delete-set"]');

    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");
  });
});
