import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SearchDashboard from "./SearchDashboard.vue";

// 1. Mock Child Components
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
  calculateDistance: vi.fn(() => 5.2),
}));

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
      municipality: "zapopan",
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
      municipality: "guadalajara",
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
      municipality: "guadalajara",
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

  let originalLocation: Location;
  let originalHistory: History;

  beforeEach(() => {
    // Mock the global fetch API to return our dummy data
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiData),
      }),
    ) as any;

    // Mock window location and history for URL param testing
    originalLocation = window.location;
    originalHistory = window.history;

    Object.defineProperty(window, "location", {
      value: { search: "", pathname: "/search" },
      writable: true,
    });

    Object.defineProperty(window, "history", {
      value: { replaceState: vi.fn() },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore window objects
    window.location.href = originalLocation.href;
    window.history = originalHistory;
    vi.clearAllMocks();
  });

  it("loads without default filters and shows all tianguis", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(3); // Should show all since no day is selected by default now
  });

  it("toggles day filters correctly", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Find and click the button for "Martes"
    const martesButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Mar"));
    await martesButton?.trigger("click");

    // Only Santa Tere (Martes) should be visible
    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(1);
    expect(wrapper.text()).toContain("Tianguis de Santa Tere");
  });

  it("toggles municipality filters correctly", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Find and click the button for "Zapopan"
    const zapopanBtn = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Zapopan"));
    await zapopanBtn?.trigger("click");

    // Only Tianguis del Sol (Zapopan) should be visible
    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(1);
    expect(wrapper.text()).toContain("Tianguis del Sol");
  });

  it("filters tianguis by search query", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue("sol");

    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(1);
    expect(wrapper.text()).toContain("Tianguis del Sol");
  });

  it("initializes state from URL parameters", async () => {
    // Pre-fill URL before mounting
    window.location.search = "?q=mayo&days=lunes&municipalities=guadalajara";

    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Check if input was populated
    const input = wrapper.find('input[type="text"]')
      .element as HTMLInputElement;
    expect(input.value).toBe("mayo");

    // Check if the filtering applied (should only match 5 de Mayo)
    const cards = wrapper.findAll(".mock-tianguis-card");
    expect(cards).toHaveLength(1);
    expect(wrapper.text()).toContain("Tianguis 5 de Mayo");
  });

  it("updates URL parameters when filters change", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    // Type in the search box
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue("santa");

    // Click a municipality
    const zapopanBtn = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Zapopan"));
    await zapopanBtn?.trigger("click");

    await wrapper.vm.$nextTick(); // Wait for watcher to trigger

    // Verify history.replaceState was called with the updated params
    expect(window.history.replaceState).toHaveBeenCalled();
    const lastCall = vi.mocked(window.history.replaceState).mock.calls.pop();
    expect(lastCall?.[2]).toContain("q=santa");
    expect(lastCall?.[2]).toContain("municipalities=zapopan");
  });

  it("requests user location and calculates distances", async () => {
    const wrapper = mount(SearchDashboard);
    await flushPromises();

    const locationButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Usar mi ubicación"));
    await locationButton?.trigger("click");
    await flushPromises();

    const geolocationModule = await import("../../utils/geolocation");
    expect(geolocationModule.getUserLocation).toHaveBeenCalledOnce();
    expect(geolocationModule.calculateDistance).toHaveBeenCalled();
  });
});
