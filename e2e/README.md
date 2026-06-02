# E2E Tests for Tianguis GDL

This directory contains end-to-end tests using Playwright to verify the functionality of the Tianguis finder application.

## Test Files

### `dashboard.spec.ts`
Tests the mobile search dashboard functionality:
- Dashboard visibility on mobile viewports
- Search functionality and URL parameter updates
- Navigation to map from tianguis cards
- Mobile-specific behaviors

### `desktop.spec.ts`
Tests the desktop experience:
- Side-by-side map and search dashboard
- Desktop-specific "Ver en mapa" behavior (pan map instead of navigate)
- Filter functionality on desktop
- Multiple filter combinations
- User location feature

### `filter-persistence.spec.ts`
Tests filter state persistence:
- URL parameter restoration on page load
- Browser back/forward navigation
- Deep links with filters
- URL updates when filters change
- Invalid parameter handling

### `map-interactions.spec.ts`
Tests map functionality:
- Map rendering and tile loading
- Marker display and interaction
- Popup content and functionality
- Google Maps link in popups
- Report issue button
- Map zoom and pan controls
- URL parameters for map centering
- Mobile vs desktop map views

## Running Tests

### Run all E2E tests
```bash
make test-e2e
```

### Run specific test suites
```bash
# Desktop tests only
make test-e2e-desktop

# Mobile dashboard tests only
make test-e2e-mobile

# Filter persistence tests only
make test-e2e-filters

# Map interaction tests only
make test-e2e-map
```

### Run with UI mode (interactive)
```bash
make test-e2e-ui
```

### Debug mode
```bash
make test-e2e-debug
```

### Run all tests (unit + types + e2e)
```bash
make test-all
```

### View all available commands
```bash
make help
```

## Test Configuration

Tests are configured in `playwright.config.ts` and run against:
- Desktop browsers: Chrome, Firefox, Safari
- Mobile viewports: Pixel 5, iPhone 12

The dev server starts automatically before tests run on `http://localhost:4321`.

## Writing New Tests

### Mobile-specific tests
Use `test.skip(!isMobile, ...)` to skip on desktop:
```typescript
test("mobile only test", async ({ isMobile, page }) => {
  test.skip(!isMobile, "Mobile-specific test");
  // test code
});
```

### Desktop-specific tests
Use `test.skip(isMobile, ...)` to skip on mobile:
```typescript
test("desktop only test", async ({ isMobile, page }) => {
  test.skip(isMobile, "Desktop-specific test");
  // test code
});
```

## CI/CD

Tests automatically:
- Retry 2 times on failure (CI only)
- Run sequentially on CI (to avoid race conditions)
- Generate HTML reports
- Capture traces on first retry for debugging

## Troubleshooting

### Server not starting
Make sure the dev server can start manually:
```bash
npm run dev
```

### Tests timing out
Increase timeout in playwright.config.ts webServer section.

### Flaky tests
Use `page.waitForSelector()` and `page.waitForTimeout()` to ensure elements are ready.

## Future Test Coverage

See the main README or project documentation for planned test additions:
- Accessibility (a11y) tests
- Performance benchmarks
- Visual regression tests
- Cross-browser compatibility
