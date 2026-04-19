import { expect, test } from "@playwright/test";
import { mockSupabaseTable } from "./helpers/supabaseRouteMocks";

test("@smoke app boots and reaches meta-data tribes view", async ({ page }) => {
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

  await page.goto("/");
  await page.locator(".nav").getByText("Admin").click();
  await page.getByRole("link", { name: "Manage Meta-Data" }).click();
  await expect(page).toHaveURL(/\/manageMetaData$/);

  await page.locator("#tribes").click();
  await expect(page.locator("text=Beast")).toBeVisible();

  await page.fill('input[placeholder="Name"]', "Murloc");
  await page.click('input[type="submit"]');
  await expect(page.locator(".Toastify__toast--info")).toContainText("Success");
});
