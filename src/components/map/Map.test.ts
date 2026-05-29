import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MapComponent from "./Map.vue";

// 1. Stub the map library components to prevent WebGL crashes in Node.js
vi.mock("@indoorequal/vue-maplibre-gl", () => ({
  MglMap: {
    name: "MglMap",
    template: '<div class="mock-mgl-map"><slot></slot></div>',
    props: ["mapStyle", "center", "zoom"],
  },
  MglNavigationControl: { template: '<div class="mock-nav"></div>' },
  MglGeolocateControl: { template: '<div class="mock-geo"></div>' },
  MglScaleControl: { template: '<div class="mock-scale"></div>' },
  MglMarker: {
    template:
      '<div class="mock-marker" :data-coords="coordinates.join(\',\')"><slot></slot></div>',
    props: ["coordinates"],
  },
  MglPopup: { template: '<div class="mock-popup"><slot></slot></div>' },
}));

describe("Map.vue", () => {
  // 2. Mock the MutationObserver (jsdom doesn't fully support it by default)
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();

  beforeEach(() => {
    // Create a proper constructor mock that works with the 'new' operator
    global.MutationObserver = vi.fn(function (this: any) {
      this.observe = observeMock;
      this.disconnect = disconnectMock;
    }) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockTianguis = [
    { name: "Valid Tianguis 1", lat: 20.65, lng: -103.35 },
    { name: "Valid Tianguis 2", lat: 20.66, lng: -103.36 },
    { name: "Invalid Tianguis", lat: 0, lng: 0 }, // Should be filtered out
    { name: "Missing Coords Tianguis" }, // Should be filtered out
  ];

  it("renders only markers for tianguis that have valid coordinates", () => {
    const wrapper = mount(MapComponent, {
      props: {
        tianguis: mockTianguis,
      },
      global: {
        // Stub the child popup component to keep the test isolated
        stubs: { TianguisPopup: true },
      },
    });

    // We passed 4 items, but only 2 have valid coordinates.
    // The component should compute `tianguisWithCoords` and render exactly 2 markers.
    const markers = wrapper.findAll(".mock-marker");
    expect(markers).toHaveLength(2);

    // Verify the coordinates were passed correctly to the mocked marker
    expect(markers[0].attributes("data-coords")).toBe("-103.35,20.65"); // Note: Lng comes first in MapLibre!
  });

  it("registers and cleans up the MutationObserver for dark mode", () => {
    const wrapper = mount(MapComponent, {
      props: { tianguis: [] },
      global: { stubs: { TianguisPopup: true } },
    });

    // It should start observing the document element on mount
    expect(observeMock).toHaveBeenCalledOnce();

    // It should clean up the observer when the component is destroyed
    wrapper.unmount();
    expect(disconnectMock).toHaveBeenCalledOnce();
  });

  it("listens for the custom tianguis:focus-map window event", async () => {
    // We want to spy on the internal flyTo method of the map instance.
    // Since we mocked MglMap, we need to simulate the @map:load event to expose the map object.
    const wrapper = mount(MapComponent, {
      props: { tianguis: mockTianguis },
      global: { stubs: { TianguisPopup: true } },
    });

    const mockFlyTo = vi.fn();

    // Trigger the @map:load event manually on our mocked map component
    await wrapper.findComponent({ name: "MglMap" }).vm.$emit("map:load", {
      map: {
        flyTo: mockFlyTo,
        fitBounds: vi.fn(), // Need to mock this too since onMapLoad calls it for multiple markers
      },
    });

    // Dispatch the custom window event
    const event = new CustomEvent("tianguis:focus-map", {
      detail: { lat: 20.7, lng: -103.4, id: "Test-ID" },
    });
    window.dispatchEvent(event);

    // The component should have caught the event and called flyTo on the map instance
    expect(mockFlyTo).toHaveBeenCalledWith({
      center: [-103.4, 20.7], // Again, MapLibre uses [lng, lat]
      zoom: 14,
      duration: 1000,
      essential: true,
    });
  });
});
