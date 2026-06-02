import { test, expect } from "@playwright/test";

test.describe("Tianguis Desktop Experience", () => {
  test.beforeEach(async ({ isMobile, page }) => {
    // Only run these tests on desktop viewports
    test.skip(
      isMobile,
      "These tests are for desktop viewports only (md:block)",
    );
    await page.goto("http://localhost:4321/");
  });

  test("should display the sidebar and welcome screen on the homepage", async ({
    page,
  }) => {
    const welcomeHeader = page.locator("h1", {
      hasText: "Bienvenido a Tianguis GDL",
    });
    await expect(welcomeHeader).toBeVisible();

    const sidebar = page.locator("aside, nav").first();
    await expect(sidebar).toBeVisible();

    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre...",
    );
    await expect(searchInput).toBeHidden();
  });

  test("should navigate to day page and show map with tianguis list", async ({
    page,
  }) => {
    const lunesLink = page.locator("a", { hasText: "Lunes" }).first();
    await lunesLink.click();

    await page.waitForURL(/.*\/lunes/);

    const mapContainer = page.locator(".maplibregl-map");
    await expect(mapContainer).toBeVisible();
  });

  test("should navigate to municipality page from sidebar", async ({
    page,
  }) => {
    // FIX: Removed ^ and $ to allow for icons or whitespace in the link text
    const zapopanLink = page.locator("a", { hasText: /Zapopan/i }).first();
    await zapopanLink.click();

    await page.waitForURL(/.*\/zapopan/);
  });

  test("should show sidebar with municipality and day links", async ({
    page,
  }) => {
    // FIX: Removed ^ and $
    const guadalajaraLink = page
      .locator("a", { hasText: /Guadalajara/i })
      .first();
    const zapopanLink = page.locator("a", { hasText: /Zapopan/i }).first();

    await expect(guadalajaraLink).toBeVisible();
    await expect(zapopanLink).toBeVisible();
  });

  test("should display map on day pages", async ({ page }) => {
    const lunesLink = page.locator("a", { hasText: "Lunes" }).first();
    await lunesLink.click();
    await page.waitForURL(/.*\/lunes/);

    // FIX: Added .first() to prevent strict mode violation
    const navigationControl = page.locator(".maplibregl-ctrl-group").first();
    await expect(navigationControl).toBeVisible();
  });

  test("should navigate to specific municipality and day combination", async ({
    page,
  }) => {
    const zapopanLink = page.locator("a", { hasText: /Zapopan/i }).first();
    await zapopanLink.click();
    await page.waitForURL(/.*\/zapopan/);

    const martesLink = page.locator("a", { hasText: "Martes" }).first();
    if ((await martesLink.count()) > 0) {
      await martesLink.click();
      await page.waitForURL(/.*\/zapopan\/martes/);
      await expect(page).toHaveURL(/zapopan\/martes/);
    }
  });

  test("should navigate back to home from sidebar", async ({ page }) => {
    const lunesLink = page.locator("a", { hasText: "Lunes" }).first();
    await lunesLink.click();
    await page.waitForURL(/.*\/lunes/);

    const homeLink = page.locator('a[href="/"]').first();
    if ((await homeLink.count()) > 0) {
      await homeLink.click();

      // Matches the base URL structure
      await page.waitForURL(/^.*:\/{2}[^\/]+\/$/);

      const welcomeHeader = page.locator("h1", {
        hasText: "Bienvenido a Tianguis GDL",
      });
      await expect(welcomeHeader).toBeVisible();
    }
  });
});
