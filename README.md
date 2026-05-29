# Tianguis GDL

An interactive web application built to help residents of the Guadalajara metropolitan area easily locate, filter, and navigate to local street markets (tianguis). 

## ✨ Features
* **Interactive Map:** View market locations using MapLibre GL with custom map markers.
* **Smart Filtering:** Filter markets by the day of the week or search by neighborhood/street name using accent-insensitive text matching.
* **Geolocation:** Instantly find the tianguis closest to your current location with real-time distance calculations.
* **Mobile-First UI:** Includes a highly responsive bottom-sheet interface for seamless mobile browsing.
* **Dark Mode:** Fully supported dark and light themes that respect system preferences.

## 🛠️ Tech Stack
* **Framework:** [Astro](https://astro.build/) (Static Site Generation)
* **UI Components:** [Vue 3](https://vuejs.org/) (Composition API)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Mapping:** [MapLibre GL JS](https://maplibre.org/)
* **Testing:** [Vitest](https://vitest.dev/) & Vue Test Utils
* **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites
Ensure you have **Node.js** installed. This project requires Node version `>=22.12.0`.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/efturtle/tianguis-gdl.git
   cd tianguis-gdl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4321`

### Available Scripts

* **`npm run dev`** - Start the development server with hot reloading
* **`npm run build`** - Build the production-ready static site
* **`npm run preview`** - Preview the production build locally
* **`npm run test`** - Run unit tests with Vitest
* **`npm run test:types`** - Run TypeScript type checking tests

## 📂 Project Structure

```
tianguis-gdl/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Vue & Astro components
│   │   ├── map/         # Map-related components (MapLibre GL)
│   │   ├── tianguis/    # Tianguis listing components
│   │   └── ui/          # Reusable UI components
│   ├── config/          # Configuration files (municipalities)
│   ├── data/            # Tianguis data by municipality (JSON)
│   ├── layouts/         # Astro layout templates
│   ├── pages/           # Astro pages and routes
│   ├── services/        # Business logic and data services
│   ├── styles/          # Global CSS and Tailwind styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions (geolocation, text)
├── public/              # Public static assets
└── tests/               # Test files (*.test.ts)
```

## 📍 Data Structure

Market (tianguis) data is organized by municipality in JSON files under `src/data/`. Each market entry includes:

* **name** - Name of the market or neighborhood
* **street1-4** - Surrounding streets that define the market location
* **lat/lng** - Geographic coordinates for map display
* **day** - Day of the week the market operates (organized by JSON key)

## 🧪 Testing

This project uses Vitest for unit testing with comprehensive coverage of:
- Vue components
- Service layer logic
- Utility functions
- TypeScript type definitions

Run tests with:
```bash
npm run test          # Run all tests
npm run test:types    # Type checking only
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.