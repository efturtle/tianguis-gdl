import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import TianguisCard from "./TianguisCard.vue";
import type { TianguisLocation } from "../../types/tianguis";

vi.mock("../../utils/geolocation", () => ({
  formatDistance: (dist: number) => `${dist} km`,
}));

describe("TianguisCard.vue", () => {
  const baseTianguis = {
    name: "Tianguis 5 de Mayo",
    municipality: "Guadalajara",
    state: "Jalisco",
    day: "martes" as const,
    lat: 20.67,
    lng: -103.34,
    location: {
      type: "streets" as const,
      street1: "Juan Bautista Ceballos",
      street2: "Pedro García Conde",
      street3: "",
      street4: "",
    } as TianguisLocation,
  };

  it("renders basic tianguis information correctly", () => {
    const wrapper = mount(TianguisCard, {
      props: {
        tianguis: baseTianguis,
      },
    });

    // Assert that the text is bound correctly
    expect(wrapper.text()).toContain("Tianguis 5 de Mayo");
    expect(wrapper.text()).toContain("Guadalajara");

    // Assert that getDayLabel properly capitalized "martes" to "Martes"
    expect(wrapper.text()).toContain("Martes");

    // Assert that formatLocation concatenated street1 and street2
    expect(wrapper.text()).toContain(
      "Juan Bautista Ceballos / Pedro García Conde",
    );
  });

  it("renders address location type correctly", () => {
    const addressTianguis = {
      ...baseTianguis,
      location: {
        type: "address" as const,
        direccion: "Avenida Fray Antonio Alcalde 10",
      },
    };

    const wrapper = mount(TianguisCard, {
      props: { tianguis: addressTianguis },
    });

    expect(wrapper.text()).toContain("Avenida Fray Antonio Alcalde 10");
  });

  it("displays the distance block when distance is provided", () => {
    const wrapper = mount(TianguisCard, {
      props: {
        tianguis: { ...baseTianguis, distance: 3.5 },
      },
    });

    // Check if the mock formatting function was applied
    expect(wrapper.text()).toContain("3.5 km");
    expect(wrapper.text()).toContain("distancia");
  });

  it("hides the distance block when distance is undefined", () => {
    const wrapper = mount(TianguisCard, {
      props: {
        tianguis: baseTianguis, // No distance provided
      },
    });

    // The word 'distancia' shouldn't exist anywhere in the component
    expect(wrapper.text()).not.toContain("distancia");
  });

  it("generates the correct map link url", () => {
    const wrapper = mount(TianguisCard, {
      props: {
        tianguis: baseTianguis,
      },
    });

    const link = wrapper.find("a");

    // Check if the href attribute was constructed correctly
    expect(link.attributes("href")).toBe(
      "/mapa?lat=20.67&lng=-103.34&name=Tianguis%205%20de%20Mayo",
    );
  });
});
