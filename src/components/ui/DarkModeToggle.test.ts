import { mount } from "@vue/test-utils";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import DarkModeToggle from "./DarkModeToggle.vue";

describe("DarkModeToggle.vue", () => {
  // 1. Create a fake localStorage object that stores data in memory
  const mockStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key] !== undefined ? this.store[key] : null;
    },
    setItem(key: string, value: string) {
      this.store[key] = value.toString();
    },
    clear() {
      this.store = {};
    },
  };

  // 2. Mock window.matchMedia for system preference detection
  const mockMatchMedia = vi.fn((query: string) => ({
    matches: false, // Default to light mode
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // 3. Inject the fake localStorage and matchMedia into the global test environment before any tests run
  beforeAll(() => {
    vi.stubGlobal("localStorage", mockStorage);
    vi.stubGlobal("matchMedia", mockMatchMedia);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // 4. Clear the DOM and our fake storage before and after each test
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
    mockMatchMedia.mockClear();
    // Reset matchMedia to return light mode by default
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  it("initializes in light mode by default", () => {
    const wrapper = mount(DarkModeToggle);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(wrapper.attributes("aria-label")).toBe("Activar modo oscuro");
  });

  it("initializes in dark mode if localStorage has it saved", async () => {
    // Simulate a user who previously turned on dark mode
    localStorage.setItem("darkMode", "true");

    const wrapper = mount(DarkModeToggle);
    await wrapper.vm.$nextTick();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(wrapper.attributes("aria-label")).toBe("Activar modo claro");
  });

  it("initializes in dark mode if the HTML tag already has the class", async () => {
    // Simulate Astro or a script injecting the class before Vue mounts
    document.documentElement.classList.add("dark");

    const wrapper = mount(DarkModeToggle);
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes("aria-label")).toBe("Activar modo claro");
  });

  it("toggles the mode, DOM, and localStorage on click", async () => {
    const wrapper = mount(DarkModeToggle);

    // Initial State -> Light Mode
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // First Click -> Dark Mode
    await wrapper.trigger("click");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("darkMode")).toBe("true");
    expect(wrapper.attributes("aria-label")).toBe("Activar modo claro");

    // Second Click -> Light Mode
    await wrapper.trigger("click");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("darkMode")).toBe("false");
    expect(wrapper.attributes("aria-label")).toBe("Activar modo oscuro");
  });
});
