import { test, expect } from "@playwright/test";

test.describe("Filter Persistence", () => {
  test.beforeEach(async ({ isMobile, page }) => {
    // SearchDashboard is only visible on mobile (md:hidden)
    test.skip(
      !isMobile,
      "Filter persistence tests require mobile viewport where SearchDashboard is visible",
    );

    await page.goto("http://localhost:4321/");
    // Wait for tianguis cards, not sidebar h3 elements
    await page.waitForSelector(".font-semibold.text-gray-900");
  });

  test("should restore search query from URL on page load", async ({
    page,
  }) => {
    // Navigate directly to a URL with search query
    await page.goto("http://localhost:4321/?q=Santa+Tere");

    // Wait for content to load
    await page.waitForSelector(".font-semibold.text-gray-900");

    // Verify the search input contains the query
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await expect(searchInput).toHaveValue("Santa Tere");

    // Verify results are filtered (check it exists in DOM, may not be in viewport)
    const resultCard = page.locator("h3", { hasText: /Santa Tere/i });
    await expect(resultCard).toHaveCount(1);
  });

  test("should restore selected days from URL on page load", async ({
    page,
  }) => {
    // Navigate with days filter
    await page.goto("http://localhost:4321/?days=lunes,martes");

    // Wait for content to load
    await page.waitForSelector(".font-semibold.text-gray-900");

    // Verify the day buttons are selected
    const lunesButton = page.locator("button", { hasText: "Lun" });
    const martesButton = page.locator("button", { hasText: "Mar" });

    await expect(lunesButton).toHaveClass(/bg-blue-600/);
    await expect(martesButton).toHaveClass(/bg-blue-600/);

    // Verify other day buttons are NOT selected
    const miercolesButton = page.locator("button", { hasText: "Mié" });
    await expect(miercolesButton).not.toHaveClass(/bg-blue-600/);
  });

  test("should restore selected municipalities from URL on page load", async ({
    page,
  }) => {
    // Navigate with municipality filter
    await page.goto("http://localhost:4321/?municipalities=guadalajara");

    // Wait for content to load
    await page.waitForSelector(".font-semibold.text-gray-900");

    // Verify the municipality button is selected
    const guadalajaraButton = page.locator("button", {
      hasText: "Guadalajara",
    });
    await expect(guadalajaraButton).toHaveClass(/bg-blue-600/);

    // Verify Zapopan is NOT selected
    const zapopanButton = page.locator("button", { hasText: "Zapopan" });
    await expect(zapopanButton).not.toHaveClass(/bg-blue-600/);
  });

  test("should restore multiple filters from URL", async ({ page }) => {
    // Navigate with all filters
    await page.goto(
      "http://localhost:4321/?q=Tianguis&days=lunes,viernes&municipalities=zapopan"
    );

    // Wait for SearchDashboard to load (not results, which may be empty)
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await searchInput.waitFor({ state: "visible" });

    // Verify search query
    await expect(searchInput).toHaveValue("Tianguis");

    // Verify days
    const lunesButton = page.locator("button", { hasText: "Lun" });
    const viernesButton = page.locator("button", { hasText: "Vie" });
    await expect(lunesButton).toHaveClass(/bg-blue-600/);
    await expect(viernesButton).toHaveClass(/bg-blue-600/);

    // Verify municipality
    const zapopanButton = page.locator("button", { hasText: "Zapopan" });
    await expect(zapopanButton).toHaveClass(/bg-blue-600/);
  });

  test("should persist filters after browser back/forward navigation", async ({
    page,
  }) => {
    // Apply filters
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await searchInput.fill("Santa");

    const zapopanButton = page.locator("button", { hasText: "Zapopan" });
    await zapopanButton.click();

    // Verify URL was updated
    await expect(page).toHaveURL(/.*q=Santa/i);
    await expect(page).toHaveURL(/.*municipalities=zapopan/i);

    // Navigate to map page
    await page.goto("http://localhost:4321/mapa");
    await page.waitForLoadState("networkidle");

    // Go back
    await page.goBack();
    await page.waitForSelector(".font-semibold.text-gray-900");

    // Verify filters are restored
    await expect(searchInput).toHaveValue("Santa");
    await expect(zapopanButton).toHaveClass(/bg-blue-600/);
    await expect(page).toHaveURL(/.*q=Santa/i);
    await expect(page).toHaveURL(/.*municipalities=zapopan/i);
  });

  test("should update URL when filters change", async ({ page }) => {
    // Initially no query params
    expect(page.url()).toBe("http://localhost:4321/");

    // Type search query
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await searchInput.fill("Mercado");
    await page.waitForTimeout(300);

    // Verify URL updated
    await expect(page).toHaveURL(/.*q=Mercado/i);

    // Add municipality filter
    const guadalajaraButton = page.locator("button", {
      hasText: "Guadalajara",
    });
    await guadalajaraButton.click();
    await page.waitForTimeout(300);

    // Verify URL updated with both params
    await expect(page).toHaveURL(/.*q=Mercado/i);
    await expect(page).toHaveURL(/.*municipalities=guadalajara/i);

    // Add day filter
    const lunesButton = page.locator("button", { hasText: "Lun" });
    await lunesButton.click();
    await page.waitForTimeout(300);

    // Verify all three params in URL
    await expect(page).toHaveURL(/.*q=Mercado/i);
    await expect(page).toHaveURL(/.*municipalities=guadalajara/i);
    await expect(page).toHaveURL(/.*days=lunes/i);
  });

  test("should clear URL params when filters are removed", async ({ page }) => {
    // Start with filters
    await page.goto("http://localhost:4321/?q=Test&municipalities=zapopan");
    
    // Wait for SearchDashboard to load
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await searchInput.waitFor({ state: "visible" });
    await searchInput.clear();
    await page.waitForTimeout(300);

    // Verify 'q' param removed but municipality remains
    expect(page.url()).not.toContain("q=");
    await expect(page).toHaveURL(/.*municipalities=zapopan/i);

    // Remove municipality filter
    const zapopanButton = page.locator("button", { hasText: "Zapopan" });
    await zapopanButton.click();
    await page.waitForTimeout(300);

    // Verify URL has no query params (just base URL with ?)
    const url = page.url();
    expect(url).toMatch(/\?$/);
  });

  test("should handle deep links with filters", async ({ page }) => {
    // Simulate user sharing a link with filters
    const deepLink =
      "http://localhost:4321/?q=Mercado&days=lunes,miercoles&municipalities=guadalajara";

    await page.goto(deepLink);
    
    // Wait for SearchDashboard to load
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await searchInput.waitFor({ state: "visible" });

    // Verify all filters are applied
    await expect(searchInput).toHaveValue("Mercado");

    const lunesButton = page.locator("button", { hasText: "Lun" });
    const miercolesButton = page.locator("button", { hasText: "Mié" });
    const guadalajaraButton = page.locator("button", {
      hasText: "Guadalajara",
    });

    await expect(lunesButton).toHaveClass(/bg-blue-600/);
    await expect(miercolesButton).toHaveClass(/bg-blue-600/);
    await expect(guadalajaraButton).toHaveClass(/bg-blue-600/);

    // Verify results are shown (may be 0 if filters don't match any tianguis)
    // Just check that the dashboard loaded without error
    const resultsSection = page.locator(".search-dashboard");
    await expect(resultsSection).toBeVisible();
  });

  test("should handle invalid URL parameters gracefully", async ({ page }) => {
    // Navigate with invalid day value
    await page.goto("http://localhost:4321/?days=invalid,lunes");
    
    // Wait for SearchDashboard to load
    await page.waitForSelector("button:has-text('Lun')");

    // Should still work and ignore invalid values
    const lunesButton = page.locator("button", { hasText: "Lun" });
    await expect(lunesButton).toHaveClass(/bg-blue-600/);

    // Navigate with invalid municipality
    await page.goto("http://localhost:4321/?municipalities=invalid");
    
    // Wait for SearchDashboard to load
    const searchInput = page.getByPlaceholder(
      "Buscar colonia, calle o nombre..."
    );
    await searchInput.waitFor({ state: "visible" });

    // Should show results or empty state (invalid filter ignored)
    // Just verify the dashboard is functional
    const dashboard = page.locator(".search-dashboard");
    await expect(dashboard).toBeVisible();
  });
});
