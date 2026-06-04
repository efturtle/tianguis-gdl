import { test, expect } from "@playwright/test";

test.describe("Tianguis Mobile Map View", () => {
  // Apply this hook to every test in this block
  test.beforeEach(async ({ isMobile, page }) => {
    // If Playwright is running a Desktop profile, skip these tests entirely
    test.skip(
      !isMobile,
      "The Mobile Map View is only visible on mobile viewports (md:hidden)",
    );

    // Navigate to the app before each test
    await page.goto("http://localhost:4321/");
  });

  test("should load the homepage and display the mobile map view", async ({
    page,
  }) => {
    // 1. Verify the mobile header is visible (inside the mobile map view)
    const header = page
      .locator(".mobile-map-view h1", { hasText: "Tianguis GDL" })
      .first();
    await expect(header).toBeVisible();

    // 2. Verify the filter buttons exist
    const municipalityFilter = page
      .locator("button", { hasText: "Todos" })
      .first();
    await expect(municipalityFilter).toBeVisible();
  });

  test("should open and close search overlay", async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Click the search button (the one with the search magnifying glass icon)
    const searchButton = page
      .locator('button')
      .filter({ has: page.locator('svg path[d*="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"]') })
      .first();

    await searchButton.click();

    // Verify the search overlay is visible
    const searchOverlay = page.locator("h2", { hasText: "Buscar Tianguis" });
    await expect(searchOverlay).toBeVisible();

    // Verify the search input exists
    const searchInput = page.getByPlaceholder(
      "Buscar por nombre, calle, municipio...",
    );
    await expect(searchInput).toBeVisible();

    // Close the overlay (X button)
    const closeButton = page
      .locator("button")
      .filter({
        has: page.locator('svg path[d*="M6 18L18 6M6 6l12 12"]'),
      })
      .first();
    await closeButton.click();

    // Verify the overlay is hidden
    await expect(searchOverlay).not.toBeVisible();
  });

  test("should open municipality filter dropdown", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Find and click the municipality filter button
    const municipalityButton = page
      .locator("button")
      .filter({
        has: page.locator('svg path[d*="M19 21V5"]'), // Building icon
      })
      .first();

    await municipalityButton.click();

    // Verify the dropdown appears with municipality options
    const guadalajaraOption = page.locator("button", {
      hasText: "Guadalajara",
    });
    await expect(guadalajaraOption).toBeVisible();

    const zapopanOption = page.locator("button", { hasText: "Zapopan" });
    await expect(zapopanOption).toBeVisible();
  });

  test("should open day filter dropdown and show grouped days", async ({
    page,
  }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Find and click the day filter button (has calendar icon)
    const dayButton = page
      .locator("button")
      .filter({
        has: page.locator('svg path[d*="M8 7V3m8 4V3"]'), // Calendar icon
      })
      .first();

    await dayButton.click();

    // Verify the dropdown appears with section headers
    const weekdaySection = page.locator("span", { hasText: "Entre semana" });
    await expect(weekdaySection).toBeVisible();

    const weekendSection = page.locator("span", { hasText: "Fin de semana" });
    await expect(weekendSection).toBeVisible();

    // Verify some day options are visible
    const lunesOption = page.locator("button", { hasText: "lunes" });
    await expect(lunesOption).toBeVisible();

    const viernesOption = page.locator("button", { hasText: "viernes" });
    await expect(viernesOption).toBeVisible();
  });

  test("should filter tianguis by municipality", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Click municipality filter
    const municipalityButton = page
      .locator("button")
      .filter({
        has: page.locator('svg path[d*="M19 21V5"]'),
      })
      .first();
    await municipalityButton.click();

    // Wait for dropdown to be visible
    const dropdown = page.locator('.header-filters > div > div').filter({ hasText: 'Guadalajara' }).first();
    await expect(dropdown).toBeVisible();

    // Select Guadalajara from the dropdown
    const guadalajaraOption = dropdown.locator("button", {
      hasText: "Guadalajara",
    });
    await guadalajaraOption.click();

    // Wait a bit for the filter to apply
    await page.waitForTimeout(100);

    // Verify the button now shows "Guadalajara" instead of "Todos"
    await expect(municipalityButton).toContainText("Guadalajara");

    // Verify dropdown is closed by checking if Zapopan option is not visible
    const zapopanOption = page.locator("button", { hasText: "Zapopan" });
    await expect(zapopanOption).not.toBeVisible();
  });

  test("should filter tianguis by day", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Click day filter
    const dayButton = page
      .locator("button")
      .filter({
        has: page.locator('svg path[d*="M8 7V3m8 4V3"]'),
      })
      .first();
    await dayButton.click();

    // Wait for dropdown to appear
    const weekdaySection = page.locator("span", { hasText: "Entre semana" });
    await expect(weekdaySection).toBeVisible();

    // Select a specific day
    const lunesOption = page.locator("button", { hasText: "lunes" });
    await lunesOption.click();

    // Wait a bit for the filter to apply
    await page.waitForTimeout(100);

    // Re-select the day button to check its content
    const updatedDayButton = page
      .locator("button")
      .filter({
        hasText: "lunes",
      })
      .first();

    // Verify the button now shows "lunes"
    await expect(updatedDayButton).toBeVisible();
    await expect(updatedDayButton).toContainText("lunes");

    // Verify dropdown is closed by checking section headers are not visible
    await expect(weekdaySection).not.toBeVisible();
  });
});
