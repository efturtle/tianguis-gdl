import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateDistance,
  formatDistance,
  getUserLocation,
} from "./geolocation";

describe("Geolocation Utilities", () => {
  describe("calculateDistance", () => {
    it("calculates distance between same coordinates as 0", () => {
      const point = { lat: 20.6736, lng: -103.344 }; // Guadalajara coordinates

      // The function uses the Haversine formula and returns distance in kilometers[cite: 4].
      expect(calculateDistance(point, point)).toBe(0);
    });

    it("calculates accurate distance between two different points", () => {
      const gdl = { lat: 20.6736, lng: -103.344 };
      const zapopan = { lat: 20.7225, lng: -103.3919 };

      const distance = calculateDistance(gdl, zapopan);

      // The distance should be roughly 7.4 km, rounded to 2 decimal places[cite: 4].
      expect(distance).toBeGreaterThan(7.0);
      expect(distance).toBeLessThan(8.0);
    });
  });

  describe("formatDistance", () => {
    it("formats distances less than 1km into meters", () => {
      // Distances < 1km should be multiplied by 1000 and rounded[cite: 4].
      expect(formatDistance(0.5)).toBe("500m");
      expect(formatDistance(0.025)).toBe("25m");
      expect(formatDistance(0.999)).toBe("999m");
    });

    it("formats distances 1km or greater into kilometers with one decimal", () => {
      // Distances >= 1km should use toFixed(1)[cite: 4].
      expect(formatDistance(1)).toBe("1.0km");
      expect(formatDistance(2.5)).toBe("2.5km");
      expect(formatDistance(12.34)).toBe("12.3km");
    });
  });

  describe("getUserLocation", () => {
    const originalGeolocation = global.navigator.geolocation;

    afterEach(() => {
      // Restore original navigator state after each test
      Object.defineProperty(global.navigator, "geolocation", {
        value: originalGeolocation,
        configurable: true,
      });
      vi.restoreAllMocks();
    });

    it("rejects if geolocation is not supported by the browser", async () => {
      // Remove geolocation from the global navigator object
      Object.defineProperty(global.navigator, "geolocation", {
        value: undefined,
        configurable: true,
      });

      // The function should return a Promise that rejects with this specific error[cite: 4].
      await expect(getUserLocation()).rejects.toThrow(
        "Geolocation is not supported by your browser",
      );
    });

    it("resolves with coordinates on success", async () => {
      const mockPosition = {
        coords: {
          latitude: 20.6596,
          longitude: -103.3496,
        },
      };

      const mockGeolocation = {
        getCurrentPosition: vi.fn().mockImplementation((successCallback) => {
          successCallback(mockPosition);
        }),
      };

      Object.defineProperty(global.navigator, "geolocation", {
        value: mockGeolocation,
        configurable: true,
      });

      const result = await getUserLocation();

      expect(result).toEqual({ lat: 20.6596, lng: -103.3496 });
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
    });

    it("rejects with permission denied message", async () => {
      const mockError = {
        code: 1, // PERMISSION_DENIED
        PERMISSION_DENIED: 1,
      };

      const mockGeolocation = {
        getCurrentPosition: vi
          .fn()
          .mockImplementation((successCallback, errorCallback) => {
            errorCallback(mockError);
          }),
      };

      Object.defineProperty(global.navigator, "geolocation", {
        value: mockGeolocation,
        configurable: true,
      });

      // It should throw the custom message for denied permissions[cite: 4].
      await expect(getUserLocation()).rejects.toThrow(
        "Location access denied. Please enable location permissions.",
      );
    });
  });
});
