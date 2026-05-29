import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SearchDashboard from "./SearchDashboard.vue";

// 1. Mock Child Components
// We stub these so we are only testing the Dashboard's logic, not the children's HTML
vi.mock("../tianguis/TianguisCard.vue", () => ({
  default: {
    template: '<div class="mock-tianguis-card">{{ tianguis.name }}</div>',
    props: ["tianguis"],
  },
}));
vi.mock("./DarkModeToggle.vue", () => ({
  default: { template: '<button class="mock-dark-mode">Dark Mode</button>' },
}));

// 2. Mock Utilities
vi.mock("../../utils/geolocation", () => ({
  getUserLocation: vi.fn(() => Promise.resolve({ lat: 20.67, lng: -103.34 })),
  calculateDistance: vi.fn(() => 5.2), // Always return 5.2km for testing
}));

// Mock the text utility to ensure predictable search matching
vi.mock("../../utils/text", () => ({
  normalizeForSearch: (text: string) => text.toLowerCase(),
  matchesSearch: (text: string, query: string) =>
    text.toLowerCase().includes(query.toLowerCase()),
}));

describe("SearchDashboard.vue", () => {
  const mockApiData = [
    {
      name: "Tianguis del Sol",
      day: "lunes",
      municipality: "Zapopan",
      lat: 20.65,
      lng: -103.4,
      location: {
        type: "streets",
        street1: "A",
        street2: "B",
        street3: "",
        street4: "",
      },
    },
    {
      name: "Tianguis de Santa Tere",
      day: "martes",
      municipality: "Guadalajara",
      lat: 20.68,
      lng: -103.36,
      location: {
        type: "streets",
        street1: "C",
        street2: "D",
        street3: "",
        street4: "",
      },
    },
    {
      name: "Tianguis 5 de Mayo",
      day: "lunes",
      municipality: "Guadalajara",
      lat: 20.67,
      lng: -103.34,
      location: {
        type: "streets",
        street1: "E",
        street2: "F",
        street3: "",
        street4: "",
      },
    },
  ];

  beforeEach(() => {
    // 3. Mock the global fetch API to return our dummy data
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiData),
      }),
    ) as any;

    // 4. Mock Date to always return Monday (day index 1)
    vi.useFakeTimers();

    // FIX: Use the comma-separated constructor to force local time (Year, Month Index, Day, Hour)
    // Month is 0-indexed, so 0 = January. We set it to 12:00 PM to be perfectly safe from timezone shifts.
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0));
  });

  it("fetches data on mount and sets the default day to today", async () => {
    const wrapper = mount(SearchDashboard);

    // Wait for the onMounted async fetch to complete
    await flushPromises();

    expect(globalThis.fetch).toHaveBeenCalledWith("/api/tianguis.json");

    // Because we set the date to Monday (2024-01-01),
    // it should only render the two monday tianguis by default
    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(2);
    expect(wrapper.text()).toContain("Tianguis del Sol");
    expect(wrapper.text()).toContain("Tianguis 5 de Mayo");
    expect(wrapper.text()).not.toContain("Tianguis de Santa Tere"); // Martes should be hidden
  });

  it("toggles day filters correctly", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Find the button for "Martes" (assuming you generate these buttons in the template)
    // Adjust the selector based on your actual template classes/content
    const martesButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Mar") || b.text().includes("Martes"));

    // Click to add Tuesday to the filter
    await martesButton?.trigger("click");

    // Now both Lunes and Martes tianguis should be visible
    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(3);
  });

  it("filters tianguis by search query", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Find the search input and type into it
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue("sol"); // Search for "Tianguis del Sol"

    // Only one tianguis should match the text "sol" AND the default day "lunes"
    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(1);
    expect(wrapper.text()).toContain("Tianguis del Sol");
  });

  it('requests user location and calculates distances when clicking "find nearby"', async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Find and click the geolocation button (the one that triggers findNearby)
    // We'll target it by looking for the SVG or a specific class.
    // Adjust the selector if your button has a specific class like .btn-location
    const locationButton = wrapper
      .findAll("button")
      .find((b) => b.html().includes("svg") && !b.html().includes("Dark Mode"));

    await locationButton?.trigger("click");
    await flushPromises(); // Wait for the getUserLocation promise to resolve

    // Verify our geolocation mock was triggered
    const geolocationModule = await import("../../utils/geolocation");
    expect(geolocationModule.getUserLocation).toHaveBeenCalledOnce();

    // Check if the component successfully calculated distance (our mock returns 5.2)
    // We can verify this by checking if the internal state updated, or if the view changed.
    // If you pass the distance prop down to TianguisCard, the view will re-render.
    expect(geolocationModule.calculateDistance).toHaveBeenCalled();
  });
});
