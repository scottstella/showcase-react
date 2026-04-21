import { expect, test } from "@playwright/test";
import { mockSupabaseTable } from "./helpers/supabaseRouteMocks";

test.describe("Meta-data navigation", () => {
  test.beforeEach(async ({ page }) => {
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
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 2, name: "Murloc", created_at: "2024-01-02T10:00:00Z" }),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

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
          body: JSON.stringify({ id: 2, name: "Priest", created_at: "2024-01-02T10:00:00Z" }),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });

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

    await mockSupabaseTable(page, "card", {
      get: async route => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      },
      post: async route => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "11111111-1111-1111-1111-111111111111",
            name: "Test Card",
            slug: "test-card",
            flavor_text: null,
            card_type: "MINION",
            rarity: "COMMON",
            spell_school: null,
            set_id: 1,
            hero_class_id: 1,
            race_tribe_id: null,
            mana_cost: 1,
            attack: 1,
            health: 1,
            durability: null,
            text: "Taunt.",
            is_collectible: true,
            is_token: false,
            image_url: null,
            image_path: null,
            artist: null,
            created_at: "2024-01-01T10:00:00Z",
            updated_at: "2024-01-01T10:00:00Z",
          }),
        });
      },
      del: async route => {
        await route.fulfill({ status: 204, body: "" });
      },
    });
  });

  test("navigates from home to Manage Meta-Data", async ({ page }) => {
    await page.goto("/");
    await page.locator(".nav").getByText("Admin").click();
    await page.getByRole("link", { name: "Manage Meta-Data" }).click();

    await expect(page).toHaveURL(/\/manageMetaData$/);
    await expect(page.getByText("make a selection")).toBeVisible();
  });

  test("switches between tribes/classes/sets sections", async ({ page }) => {
    await page.goto("/manageMetaData");

    await page.locator("#tribes").click();
    await expect(page.locator("tbody")).toContainText("Beast");
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    await page.locator("#classes").click();
    await expect(page.locator("tbody")).toContainText("Mage");
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();

    await page.locator("#sets").click();
    await expect(page.locator("tbody")).toContainText("Core");
    await expect(page.locator('label[for="release_date"]')).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Standard Set" })).toBeVisible();
  });

  test("navigates from home to Manage Cards", async ({ page }) => {
    await page.goto("/");
    await page.locator(".nav").getByText("Admin").click();
    await page.getByRole("link", { name: "Manage Cards" }).click();

    await expect(page).toHaveURL(/\/manageCards$/);
    await expect(page.getByTestId("add-card-form")).toBeVisible();
  });
});
