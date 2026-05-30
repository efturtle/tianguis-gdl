.PHONY: test test-types test-all clean build dev preview help

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

# Run all tests
test-all: test test-types
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
	@echo "  make test        - Run unit tests"
	@echo "  make test-types  - Run type checking tests"
	@echo "  make test-all    - Run all tests (unit + types)"
	@echo "  make build       - Build the project"
	@echo "  make dev         - Start development server"
	@echo "  make preview     - Start preview server"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make install     - Install dependencies"
	@echo "  make help        - Show this help message"