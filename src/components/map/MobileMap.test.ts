import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MobileMap from "./MobileMap.vue";
import type { TianguisLocation } from "../../types/tianguis";

// 1. Mock the map library to prevent WebGL crashes
vi.mock("@indoorequal/vue-maplibre-gl", () => ({
  MglMap: { template: '<div class="mock-mgl-map"><slot></slot></div>' },
  MglNavigationControl: { template: '<div class="mock-nav"></div>' },
  MglGeolocateControl: { template: '<div class="mock-geo"></div>' },
  MglMarker: {
    template: '<div class="mock-marker"><slot></slot></div>',
    props: ["coordinates"],
  },
  MglPopup: { template: '<div class="mock-popup"><slot></slot></div>' },
}));

// 2. Mock external dependencies
vi.mock("../../utils/geolocation", () => ({
  formatDistance: (dist: number) => `${dist} km`,
  calculateDistance: () => 2.5,
  getUserLocation: vi.fn(() => Promise.resolve({ lat: 20.67, lng: -103.34 })),
}));

// 3. Mock UI components that aren't the focus of this test
vi.mock("./TianguisPopup.vue", () => ({
  default: { template: "<div>Popup</div>" },
}));
vi.mock("./../ui/DarkModeToggle.vue", () => ({
  default: { template: "<button>Dark Mode</button>" },
}));

describe("MobileMap.vue", () => {
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();

  const mockTianguis = [
    {
      name: "Tianguis del Sol",
      municipality: "zapopan",
      state: "jalisco",
      day: "miercoles" as const,
      lat: 20.65,
      lng: -103.4,
      distance: 2.5,
      location: {
        type: "streets" as const,
        street1: "Copérnico",
        street2: "Moctezuma",
        street3: "",
        street4: "",
      } as TianguisLocation,
    },
  ];

  beforeEach(() => {
    vi.stubGlobal("window", {
      ...globalThis.window,
      location: { search: "" },
      open: vi.fn(),
      history: { back: vi.fn() },
    });

    // Create a proper constructor mock that works with the 'new' operator
    global.MutationObserver = vi.fn(function (this: any) {
      this.observe = observeMock;
      this.disconnect = disconnectMock;
    }) as any;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("mounts without crashing and sets up dark mode observer", () => {
    const wrapper = mount(MobileMap, { props: { tianguis: mockTianguis } });

    // Checks that the component renders the mocked map wrapper
    expect(wrapper.find(".mock-mgl-map").exists()).toBe(true);

    // Checks that the theme observer is successfully started
    expect(observeMock).toHaveBeenCalledOnce();
  });

});
