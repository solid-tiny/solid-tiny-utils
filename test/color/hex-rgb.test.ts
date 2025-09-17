import { describe, expect, it } from "vitest";
import { hexToRgb, isValidHex, rgbToHex } from "~/color";

describe("Hex ↔ RGB conversion utilities", () => {
  describe("hexToRgb", () => {
    it("should convert 6-digit hex to RGB", () => {
      expect(hexToRgb("#ffcc00")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#ff0080")).toEqual({ r: 255, g: 0, b: 128 });
    });

    it("should convert 6-digit hex without hash to RGB", () => {
      expect(hexToRgb("ffcc00")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should convert 3-digit hex to RGB", () => {
      expect(hexToRgb("#fc0")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#f08")).toEqual({ r: 255, g: 0, b: 136 });
    });

    it("should convert 3-digit hex without hash to RGB", () => {
      expect(hexToRgb("fc0")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("fff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should handle mixed case hex", () => {
      expect(hexToRgb("#FfCc00")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("FFCC00")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("#fC0")).toEqual({ r: 255, g: 204, b: 0 });
    });

    it("should handle whitespace", () => {
      expect(hexToRgb("  #ffcc00  ")).toEqual({ r: 255, g: 204, b: 0 });
      expect(hexToRgb("  ffcc00  ")).toEqual({ r: 255, g: 204, b: 0 });
    });

    it("should return null for invalid hex strings", () => {
      expect(hexToRgb("#invalid")).toBe(null);
      expect(hexToRgb("#ff")).toBe(null);
      expect(hexToRgb("#ffcc")).toBe(null);
      expect(hexToRgb("#ffcc000")).toBe(null);
      expect(hexToRgb("#ggcc00")).toBe(null);
      expect(hexToRgb("")).toBe(null);
      expect(hexToRgb("not a color")).toBe(null);
    });

    it("should return null for non-string inputs", () => {
      // @ts-expect-error - Testing invalid input types
      expect(hexToRgb(null)).toBe(null);
      // @ts-expect-error - Testing invalid input types
      expect(hexToRgb(undefined)).toBe(null);
      // @ts-expect-error - Testing invalid input types
      expect(hexToRgb(123)).toBe(null);
    });
  });

  describe("rgbToHex", () => {
    it("should convert RGB to hex", () => {
      expect(rgbToHex({ r: 255, g: 204, b: 0 })).toBe("#ffcc00");
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe("#ffffff");
      expect(rgbToHex({ r: 255, g: 0, b: 128 })).toBe("#ff0080");
    });

    it("should clamp RGB values to valid range", () => {
      expect(rgbToHex({ r: 300, g: 204, b: 0 })).toBe("#ffcc00");
      expect(rgbToHex({ r: 255, g: -10, b: 0 })).toBe("#ff0000");
      expect(rgbToHex({ r: 255, g: 204, b: 500 })).toBe("#ffccff");
      expect(rgbToHex({ r: -50, g: -100, b: -200 })).toBe("#000000");
    });

    it("should handle decimal values by rounding", () => {
      expect(rgbToHex({ r: 255.7, g: 203.4, b: 0.1 })).toBe("#ffcb00");
      expect(rgbToHex({ r: 127.5, g: 127.5, b: 127.5 })).toBe("#808080");
    });
  });

  describe("isValidHex", () => {
    it("should return true for valid hex strings", () => {
      expect(isValidHex("#ffcc00")).toBe(true);
      expect(isValidHex("ffcc00")).toBe(true);
      expect(isValidHex("#fc0")).toBe(true);
      expect(isValidHex("fc0")).toBe(true);
      expect(isValidHex("#000")).toBe(true);
      expect(isValidHex("#fff")).toBe(true);
      expect(isValidHex("#FfCc00")).toBe(true);
    });

    it("should return false for invalid hex strings", () => {
      expect(isValidHex("#invalid")).toBe(false);
      expect(isValidHex("#ff")).toBe(false);
      expect(isValidHex("#ffcc")).toBe(false);
      expect(isValidHex("#ffcc000")).toBe(false);
      expect(isValidHex("#ggcc00")).toBe(false);
      expect(isValidHex("")).toBe(false);
      expect(isValidHex("not a color")).toBe(false);
    });
  });

  describe("round-trip conversion", () => {
    it("should maintain values through hex → RGB → hex conversion", () => {
      const testColors = [
        "#000000",
        "#ffffff",
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffcc00",
        "#ff0080",
        "#808080",
      ];

      for (const color of testColors) {
        const rgb = hexToRgb(color);
        expect(rgb).not.toBe(null);
        if (rgb) {
          const backToHex = rgbToHex(rgb);
          expect(backToHex).toBe(color);
        }
      }
    });

    it("should maintain values through RGB → hex → RGB conversion", () => {
      const testRgbs = [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 204, b: 0 },
        { r: 128, g: 128, b: 128 },
      ];

      for (const rgb of testRgbs) {
        const hex = rgbToHex(rgb);
        const backToRgb = hexToRgb(hex);
        expect(backToRgb).toEqual(rgb);
      }
    });
  });
});
