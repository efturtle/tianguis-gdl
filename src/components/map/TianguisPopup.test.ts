import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TianguisPopup from "./TianguisPopup.vue";

describe("TianguisPopup.vue", () => {
  // Base mock object to use across tests
  const baseTianguis = {
    name: "Tianguis 5 de Mayo",
    day: "martes",
    municipality: "guadalajara",
    lat: 20.67,
    lng: -103.34,
    location: {
      type: "streets",
      street1: "Juan Bautista Ceballos",
      street2: "Pedro García Conde",
    },
  };

  it("renders the tianguis name correctly", () => {
    const wrapper = mount(TianguisPopup, {
      props: { tianguis: baseTianguis },
    });

    // The h3 tag should contain the name
    expect(wrapper.find("h3").text()).toBe("Tianguis 5 de Mayo");
  });

  it("capitalizes the day correctly", () => {
    const wrapper = mount(TianguisPopup, {
      props: { tianguis: baseTianguis },
    });

    // The logic should convert "martes" to "Martes"
    expect(wrapper.text()).toContain("Martes");
  });

  it("capitalizes the municipality correctly", () => {
    const wrapper = mount(TianguisPopup, {
      props: { tianguis: baseTianguis },
    });

    // The logic should convert "guadalajara" to "Guadalajara"
    expect(wrapper.text()).toContain("Guadalajara");
  });

  describe("Location Formatting", () => {
    it('formats a "streets" location type', () => {
      const wrapper = mount(TianguisPopup, {
        props: { tianguis: baseTianguis },
      });

      expect(wrapper.text()).toContain(
        "Juan Bautista Ceballos / Pedro García Conde",
      );
    });

    it('formats an "address" location type', () => {
      const addressTianguis = {
        ...baseTianguis,
        location: {
          type: "address",
          direccion: "Avenida Fray Antonio Alcalde 10",
        },
      };

      const wrapper = mount(TianguisPopup, {
        props: { tianguis: addressTianguis },
      });

      expect(wrapper.text()).toContain("Avenida Fray Antonio Alcalde 10");
    });

    it("handles legacy fallback data (raw direccion)", () => {
      // Testing the fallback branch in your formatLocation function
      const legacyTianguis = {
        name: "Legacy Market",
        day: "lunes",
        municipality: "zapopan",
        direccion: "Calle Antigua 123",
        // Missing the structured 'location' object entirely
      };

      const wrapper = mount(TianguisPopup, {
        props: { tianguis: legacyTianguis },
      });

      expect(wrapper.text()).toContain("Calle Antigua 123");
    });

    it("returns default text when location is completely missing", () => {
      const emptyTianguis = {
        name: "Ghost Market",
        day: "domingo",
        municipality: "zapopan",
      };

      const wrapper = mount(TianguisPopup, {
        props: { tianguis: emptyTianguis },
      });

      expect(wrapper.text()).toContain("Ubicación no disponible");
    });
  });

  it("renders the Google Maps link", () => {
    const wrapper = mount(TianguisPopup, {
      props: { tianguis: baseTianguis },
    });

    const link = wrapper.find("a");

    expect(link.exists()).toBe(true);
    expect(link.text()).toContain("Ver en Google Maps");

    // Verifies that the coordinates made it into the href attribute
    const href = link.attributes("href");
    expect(href).toContain("20.67");
    expect(href).toContain("-103.34");
  });
});
