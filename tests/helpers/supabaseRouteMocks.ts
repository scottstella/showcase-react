import type { Page, Route } from "@playwright/test";

export type RouteHandler = (route: Route) => Promise<void>;

type TableHandlers = {
  get?: RouteHandler;
  post?: RouteHandler;
  del?: RouteHandler;
};

export async function fulfillCorsPreflight(route: Route): Promise<void> {
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

export async function mockSupabaseTable(
  page: Page,
  table: string,
  handlers: TableHandlers
): Promise<void> {
  await page.route(`**/rest/v1/${table}*`, async route => {
    const method = route.request().method();

    if (method === "OPTIONS") {
      await fulfillCorsPreflight(route);
      return;
    }
    if (method === "GET" && handlers.get) {
      await handlers.get(route);
      return;
    }
    if (method === "POST" && handlers.post) {
      await handlers.post(route);
      return;
    }
    if (method === "DELETE" && handlers.del) {
      await handlers.del(route);
      return;
    }

    await route.fallback();
  });
}
