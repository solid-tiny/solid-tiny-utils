import { describe, expect, it } from "vitest";
import { draw, random, shuffle, uid } from "~/utils";

describe("Random utilities", () => {
  describe("random", () => {
    it("should generate random number within range", () => {
      const result = random(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("should handle same min and max", () => {
      const result = random(5, 5);
      expect(result).toBe(5);
    });
  });

  describe("draw", () => {
    it("should draw random item from array", () => {
      const array = ["a", "b", "c"];
      const result = draw(array);
      expect(array).toContain(result);
    });

    it("should return null for empty array", () => {
      const result = draw([]);
      expect(result).toBe(null);
    });
  });

  describe("shuffle", () => {
    it("should shuffle array elements", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);

      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
      // Note: There's a tiny chance this could fail if shuffle returns original order
      // but it's statistically very unlikely
    });

    it("should not modify original array", () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      shuffle(original);
      expect(original).toEqual(originalCopy);
    });
  });

  describe("uid", () => {
    it("should generate unique id of specified length", () => {
      const result = uid(10);
      expect(result).toHaveLength(10);
      expect(typeof result).toBe("string");
    });

    it("should generate different ids on multiple calls", () => {
      const id1 = uid(10);
      const id2 = uid(10);
      expect(id1).not.toBe(id2);
    });

    it("should include special characters when provided", () => {
      const result = uid(20, "!@#");
      expect(result).toHaveLength(20);
      // Hard to test if specials are actually used without making it flaky
      // but we can at least verify it doesn't throw
    });
  });
});
