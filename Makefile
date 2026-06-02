.PHONY: test test-types test-e2e test-e2e-desktop test-e2e-mobile test-e2e-filters test-e2e-map test-e2e-ui test-e2e-debug test-all clean build dev preview help

# Default target
.DEFAULT_GOAL := help

# Run unit tests
test:
	@echo "Running unit tests..."
	npm run test

# Run type checking tests
test-types:
	@echo "Running type checking tests..."
	npm run test:types

# Run E2E tests
test-e2e:
	@echo "Running E2E tests..."
	npx playwright test

# Run desktop E2E tests
test-e2e-desktop:
	@echo "Running desktop E2E tests..."
	npx playwright test desktop.spec.ts

# Run mobile E2E tests
test-e2e-mobile:
	@echo "Running mobile E2E tests..."
	npx playwright test dashboard.spec.ts

# Run filter persistence tests
test-e2e-filters:
	@echo "Running filter persistence tests..."
	npx playwright test filter-persistence.spec.ts

# Run map interaction tests
test-e2e-map:
	@echo "Running map interaction tests..."
	npx playwright test map-interactions.spec.ts

# Run map interaction tests
test-e2e-map-chromium:
	@echo "Running map interaction tests..."
	npx playwright test map-interactions.spec.ts --project="chromium"

# Run E2E tests in UI mode
test-e2e-ui:
	@echo "Running E2E tests in UI mode..."
	npx playwright test --ui

# Run E2E tests in debug mode
test-e2e-debug:
	@echo "Running E2E tests in debug mode..."
	npx playwright test --debug

# Run all tests (unit + types + e2e)
test-all: test test-types test-e2e
	@echo "✅ All tests completed!"

# Build the project
build:
	@echo "Building project..."
	npm run build

# Run dev server
dev:
	@echo "Starting dev server..."
	npm run dev

# Run preview server
preview:
	@echo "Starting preview server..."
	npm run preview

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist .astro

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm ci

# Help command
help:
	@echo "Available commands:"
	@echo ""
	@echo "Unit Tests:"
	@echo "  make test              - Run unit tests"
	@echo "  make test-types        - Run type checking tests"
	@echo ""
	@echo "E2E Tests:"
	@echo "  make test-e2e          - Run all E2E tests"
	@echo "  make test-e2e-desktop  - Run desktop E2E tests"
	@echo "  make test-e2e-mobile   - Run mobile E2E tests"
	@echo "  make test-e2e-filters  - Run filter persistence tests"
	@echo "  make test-e2e-map      - Run map interaction tests"
	@echo "  make test-e2e-ui       - Run E2E tests in UI mode (interactive)"
	@echo "  make test-e2e-debug    - Run E2E tests in debug mode"
	@echo ""
	@echo "All Tests:"
	@echo "  make test-all          - Run all tests (unit + types + e2e)"
	@echo ""
	@echo "Development:"
	@echo "  make dev               - Start development server"
	@echo "  make build             - Build the project"
	@echo "  make preview           - Start preview server"
	@echo "  make clean             - Clean build artifacts"
	@echo "  make install           - Install dependencies"
	@echo ""
	@echo "Help:"
	@echo "  make help              - Show this help message"