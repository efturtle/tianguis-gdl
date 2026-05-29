import { describe, it, expect, vi, beforeEach } from "vitest";
import { TianguisService, formatLocation } from "./tianguis";
import type { TianguisLocation } from "../types/tianguis";

// 1. Mock the external text utility
vi.mock("../utils/text", () => ({
  normalizeForSearch: (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
}));

// 2. Mock the municipalities config
vi.mock("../config/municipalities", () => ({
  MUNICIPALITIES: [{ slug: "zapopan", stateSlug: "jalisco" }],
}));

// 3. Mock the dynamic JSON import that the service relies on
vi.mock("../data/zapopan.json", () => ({
  default: {
    lunes: [
      {
        name: "Tianguis del Sol",
        street1: "Copérnico",
        street2: "Moctezuma",
        street3: "Tepeyac",
        street4: "Colinas",
        lat: 20.65,
        lng: -103.4,
      },
      {
        name: "Mercado Sin Coordenadas",
        direccion: "Avenida Siempre Viva 123",
        // Omitting lat/lng to test default fallbacks
      },
      {
        name: "Tianguis Inválido",
        // Omitting both street1 and direccion to test skipping invalid entries
      },
    ],
  },
}));

describe("formatLocation", () => {
  it('formats "address" type correctly', () => {
    const location: TianguisLocation = {
      type: "address",
      direccion: "Calle Falsa 123",
    };

    // It should return location.direccion[cite: 1]
    expect(formatLocation(location)).toBe("Calle Falsa 123");
  });

  it('formats "streets" type correctly', () => {
    const location: TianguisLocation = {
      type: "streets",
      street1: "Avenida A",
      street2: "Calle B",
      street3: "Calle C",
      street4: "Calle D",
    };

    // It should format as street1 entre street2, street3 y street4[cite: 1]
    expect(formatLocation(location)).toBe(
      "Avenida A entre Calle B, Calle C y Calle D",
    );
  });
});

describe("TianguisService", () => {
  // Clear mocks before each test to ensure clean state
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Data Normalization", () => {
    it("normalizes local JSON data correctly", async () => {
      const result = await TianguisService.getTianguisByMunicipality(
        "jalisco",
        "zapopan",
      );

      // The invalid entry should be skipped[cite: 1]
      expect(result).toHaveLength(2);

      // Verify the 'streets' object mapping[cite: 1]
      expect(result[0].name).toBe("Tianguis del Sol");
      expect(result[0].location.type).toBe("streets");
      expect(result[0].lat).toBe(20.65);

      // Verify default fallbacks for lat/lng[cite: 1]
      expect(result[1].name).toBe("Mercado Sin Coordenadas");
      expect(result[1].location.type).toBe("address");
      expect(result[1].lat).toBe(0); // Should default to 0 if not provided[cite: 1]
      expect(result[1].lng).toBe(0); // Should default to 0 if not provided[cite: 1]
    });
  });

  describe("Data Filtering", () => {
    it("filters tianguis by day", async () => {
      const result = await TianguisService.getTianguis({
        day: "lunes",
        municipality: "zapopan",
      });

      // All valid normalized entries are on 'lunes' based on our mock
      expect(result.every((t) => t.day === "lunes")).toBe(true);
    });

    it("filters tianguis by search query", async () => {
      // The search filter uses normalizeForSearch for accent-insensitive matching[cite: 1]
      const result = await TianguisService.getTianguis({
        search: "sol",
        municipality: "zapopan",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Tianguis del Sol");
    });

    it("handles empty municipality fetching all data for state", async () => {
      // If municipality is missing, it loads all local data for the state[cite: 1]
      const result = await TianguisService.getTianguis({ state: "jalisco" });

      // Because we mocked MUNICIPALITIES to only have Zapopan, it should return Zapopan's 2 valid entries
      expect(result).toHaveLength(2);
    });
  });
});
