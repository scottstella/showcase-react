import { expect, test } from "@playwright/test";

type CardRow = {
  id: string;
  name: string;
  slug: string;
  flavor_text: string | null;
  card_type: string;
  rarity: string;
  spell_school: string | null;
  set_id: number;
  hero_class_id: number;
  race_tribe_id: number | null;
  mana_cost: number;
  attack: number | null;
  health: number | null;
  durability: number | null;
  text: string;
  is_collectible: boolean;
  is_token: boolean;
  image_url: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

function baseCard(partial: Partial<CardRow>): CardRow {
  return {
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
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
    ...partial,
  };
}

async function setupCardsPageRoutes(
  page: Parameters<typeof test>[0]["page"],
  options?: { blockAddWithRls?: boolean }
) {
  const cards: CardRow[] = [baseCard({})];

  await page.route("**/rest/v1/card*", async route => {
    const method = route.request().method();
    const url = route.request().url();

    if (method === "OPTIONS") {
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    if (method === "GET") {
      const rows = cards.map(c => ({
        ...c,
        set: { id: 1, name: "Core" },
        hero_class: { id: 1, name: "Mage" },
        race_tribe: null,
        card_mechanic_map: [{ mechanic: "TAUNT" }],
        card_keyword: [],
        card_related_card: [],
      }));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(rows),
      });
      return;
    }

    if (method === "POST") {
      if (options?.blockAddWithRls) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
        return;
      }

      const payload = route.request().postDataJSON() as Record<string, unknown>[];
      const row = payload[0];
      const created = baseCard({
        id: "22222222-2222-2222-2222-222222222222",
        name: String(row.name),
        slug: String(row.slug),
        card_type: String(row.card_type),
        rarity: String(row.rarity),
        spell_school: (row.spell_school as string | null) ?? null,
        set_id: Number(row.set_id),
        hero_class_id: Number(row.hero_class_id),
        race_tribe_id: (row.race_tribe_id as number | null) ?? null,
        mana_cost: Number(row.mana_cost),
        attack: (row.attack as number | null) ?? null,
        health: (row.health as number | null) ?? null,
        durability: (row.durability as number | null) ?? null,
        text: String(row.text),
        is_collectible: Boolean(row.is_collectible),
        is_token: Boolean(row.is_token),
        updated_at: "2024-01-02T10:00:00Z",
      });
      cards.push(created);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created),
      });
      return;
    }

    if (method === "PATCH") {
      const payload = route.request().postDataJSON() as Partial<CardRow>;
      const match = /[?&]id=eq\.([^&]+)/.exec(url);
      const id = decodeURIComponent(match?.[1] ?? "");
      const index = cards.findIndex(c => c.id === id);

      if (index >= 0) {
        cards[index] = {
          ...cards[index],
          ...payload,
          updated_at: "2024-01-03T10:00:00Z",
        };
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(cards[index] ?? {}),
      });
      return;
    }

    if (method === "DELETE") {
      const match = /[?&]id=eq\.([^&]+)/.exec(url);
      const id = decodeURIComponent(match?.[1] ?? "");
      const index = cards.findIndex(c => c.id === id);
      if (index >= 0) cards.splice(index, 1);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id }]),
      });
      return;
    }

    await route.fallback();
  });

  await page.route("**/rest/v1/set*", async route => {
    const method = route.request().method();
    if (method === "GET") {
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
      return;
    }
    await route.fallback();
  });

  await page.route("**/rest/v1/hero_class*", async route => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: 1, name: "Mage", created_at: "2024-01-01T10:00:00Z" }]),
      });
      return;
    }
    await route.fallback();
  });

  await page.route("**/rest/v1/tribe*", async route => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: 1, name: "Beast", created_at: "2024-01-01T10:00:00Z" }]),
      });
      return;
    }
    await route.fallback();
  });

  await page.route("**/rest/v1/card_mechanic_map*", async route => {
    const method = route.request().method();
    if (method === "DELETE") {
      await route.fulfill({ status: 204, body: "" });
      return;
    }
    if (method === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }
    await route.fallback();
  });

  await page.route("**/rest/v1/card_keyword*", async route => {
    const method = route.request().method();
    if (method === "DELETE") {
      await route.fulfill({ status: 204, body: "" });
      return;
    }
    if (method === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }
    await route.fallback();
  });

  await page.route("**/rest/v1/card_related_card*", async route => {
    const method = route.request().method();
    if (method === "DELETE") {
      await route.fulfill({ status: 204, body: "" });
      return;
    }
    if (method === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }
    await route.fallback();
  });
}

async function goToManageCards(page: Parameters<typeof test>[0]["page"]) {
  await page.goto("/");
  await page.locator(".nav").getByText("Admin").click();
  await page.getByRole("link", { name: "Manage Cards" }).click();
  await expect(page).toHaveURL(/\/manageCards$/);
}

test.describe("Manage Cards E2E", () => {
  test("creates a new card and shows success toast", async ({ page }) => {
    await setupCardsPageRoutes(page);
    await goToManageCards(page);

    await expect(page.getByText("Test Card")).toBeVisible();

    await page.fill("#name", "Alpha Card");
    await expect(page.getByTestId("add-card-slug")).toHaveValue("alpha-card");
    await page.selectOption("#set_id", "1");
    await page.selectOption("#hero_class_id", "1");
    await page.fill("#mana_cost", "2");
    await page.fill("#attack", "2");
    await page.fill("#health", "3");
    await page.fill("#text", "Battlecry: Draw a card.");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--info")).toContainText(
      "Card saved (no image selected)"
    );
    await expect(page.getByText("Alpha Card")).toBeVisible();
  });

  test("edits a card from table row click", async ({ page }) => {
    await setupCardsPageRoutes(page);
    await goToManageCards(page);

    await page.getByTestId("card-row-11111111-1111-1111-1111-111111111111").click();
    await expect(page.getByRole("dialog", { name: "Edit Card" })).toBeVisible();

    await page.fill("#edit-name", "Edited Card");
    await expect(page.getByTestId("edit-card-slug")).toHaveValue("edited-card");
    await page.fill("#edit-text", "Updated text");
    await page.getByTestId("edit-save").click();

    await expect(page.locator(".Toastify__toast--info")).toContainText("Record updated");
    await expect(page.getByText("Edited Card")).toBeVisible();
  });

  test("shows auth-required error when card add is blocked by RLS", async ({ page }) => {
    await setupCardsPageRoutes(page, { blockAddWithRls: true });
    await goToManageCards(page);

    await page.fill("#name", "Blocked Card");
    await page.selectOption("#set_id", "1");
    await page.selectOption("#hero_class_id", "1");
    await page.fill("#mana_cost", "2");
    await page.fill("#attack", "2");
    await page.fill("#health", "2");
    await page.fill("#text", "Nope");
    await page.click('input[type="submit"]');

    await expect(page.locator(".Toastify__toast--error")).toContainText("You must be logged in");
  });

  test("deletes a card and removes it from results", async ({ page }) => {
    await setupCardsPageRoutes(page);
    await goToManageCards(page);

    await expect(page.getByText("Test Card")).toBeVisible();
    await page.getByTestId("delete-card").first().click();

    await expect(page.locator(".Toastify__toast--info")).toContainText("Success");
    await expect(page.getByText("Test Card")).not.toBeVisible();
  });
});
