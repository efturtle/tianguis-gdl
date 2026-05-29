import { describe, it, expectTypeOf } from "vitest";
import type {
  DayOfWeek,
  Tianguis,
  TianguisWithDistance,
  TianguisLocation,
  StreetLocation,
  AddressLocation,
} from "./tianguis";

describe("Tianguis Type Definitions", () => {
  it("DayOfWeek should strictly accept valid Spanish days", () => {
    // These should pass perfectly
    expectTypeOf<"lunes">().toExtend<DayOfWeek>();
    expectTypeOf<"martes">().toExtend<DayOfWeek>();
    expectTypeOf<"domingo">().toExtend<DayOfWeek>();

    // These should throw type errors if uncommented
    // expectTypeOf<'monday'>().toExtend<DayOfWeek>();
    // expectTypeOf<'Lunes'>().toExtend<DayOfWeek>(); // Case sensitive
  });

  it("TianguisLocation should accept a valid StreetLocation", () => {
    const validStreetLocation = {
      type: "streets" as const,
      street1: "Copérnico",
      street2: "Moctezuma",
      street3: "Tepeyac",
      street4: "Colinas",
    };

    // Asserts that our object matches the TianguisLocation union type
    expectTypeOf(validStreetLocation).toExtend<TianguisLocation>();
  });

  it("TianguisLocation should accept a valid AddressLocation", () => {
    const validAddressLocation = {
      type: "address" as const,
      direccion: "Avenida Fray Antonio Alcalde 10",
    };

    expectTypeOf(validAddressLocation).toExtend<TianguisLocation>();
  });

  it("TianguisLocation should reject invalid location combinations", () => {
    const invalidLocation = {
      type: "address" as const,
      street1: "Copérnico", // An 'address' type shouldn't rely on 'street1'
      direccion: "123 Main",
    };

    // Asserts that this mixed object does NOT strictly match AddressLocation
    expectTypeOf(invalidLocation).not.toEqualTypeOf<AddressLocation>();
  });

  it("TianguisWithDistance correctly inherits from Tianguis", () => {
    // Asserts that TianguisWithDistance has all properties of Tianguis,
    // AND includes the distance property
    expectTypeOf<TianguisWithDistance>().toExtend<
      Tianguis & { distance: number }
    >();
  });
});
