import { test, expect } from "@playwright/test";

test.describe("Tianguis Search Dashboard (Mobile UI)", () => {
  // Apply this hook to every test in this block
  test.beforeEach(async ({ isMobile, page }) => {
    // If Playwright is running a Desktop profile, skip these tests entirely
    test.skip(
      !isMobile,
      "The Search Dashboard is only visible on mobile viewports (md:hidden)",
    );

    // Navigate to the app before each test
    await page.goto("http://localhost:4321/");
  });

  test("should load the homepage and display the dashboard", async ({
    page,
  }) => {
    // 1. Verify the header is visible
    const header = page.locator("h1", { hasText: "Encuentra tu Tianguis" });
    await expect(header).toBeVisible();

    // 2. Verify the search input exists
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre...",
    );
    await expect(searchInput).toBeVisible();
  });

  test("should filter tianguis when searching", async ({ page }) => {
    // Wait for the initial tianguis to load (wait for tianguis cards to render)
    // Use a more specific selector to avoid matching sidebar h3 elements
    await page.waitForSelector(".font-semibold.text-gray-900");

    // Type into the search bar
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre...",
    );
    await searchInput.fill("Santa Tere");

    // Verify the URL updated to include the query parameter
    await expect(page).toHaveURL(/.*q=Santa\+Tere/i);

    // Verify the card for Santa Tere appears
    const resultCard = page.locator("h3", { hasText: /Santa Tere/i });
    await expect(resultCard).toBeVisible();
  });

  test("should navigate to map correctly on mobile", async ({ page }) => {
    // Wait for tianguis cards to load first
    await page.waitForSelector(".font-semibold.text-gray-900");

    // Click the "Ver en mapa" link on the first available tianguis card
    const firstMapLink = page.locator("a", { hasText: "Ver en mapa" }).first();

    // Extract the href to verify it contains map parameters
    const href = await firstMapLink.getAttribute("href");
    expect(href).toContain("/mapa?lat=");

    // Click it and verify navigation
    await firstMapLink.click();
    await expect(page).toHaveURL(/.*\/mapa\?lat=.*/);
  });
});
