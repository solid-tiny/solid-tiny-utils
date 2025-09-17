import { describe, expect, it } from "vitest";
import { iterate, list, range } from "~/utils";

describe("Array utilities", () => {
  describe("iterate", () => {
    it("should iterate specified number of times", () => {
      const result = iterate(3, (acc, i) => acc + i, 0);
      expect(result).toBe(6); // 0 + 1 + 2 + 3
    });

    it("should start from 1 not 0", () => {
      const iterations: number[] = [];
      iterate(
        3,
        (acc, i) => {
          iterations.push(i);
          return acc;
        },
        0
      );
      expect(iterations).toEqual([1, 2, 3]);
    });
  });

  describe("range", () => {
    it("should generate range with single parameter", () => {
      const result = Array.from(range(3));
      expect(result).toEqual([0, 1, 2, 3]);
    });

    it("should generate range with start and end", () => {
      const result = Array.from(range(1, 3));
      expect(result).toEqual([1, 2, 3]);
    });

    it("should generate range with mapper function", () => {
      const result = Array.from(range(0, 2, (i) => `item${i}`));
      expect(result).toEqual(["item0", "item1", "item2"]);
    });

    it("should generate range with step", () => {
      const result = Array.from(range(0, 6, (i) => i, 2));
      expect(result).toEqual([0, 2, 4, 6]);
    });
  });

  describe("list", () => {
    it("should create list from range", () => {
      const result = list(3);
      expect(result).toEqual([0, 1, 2, 3]);
    });

    it("should create list with custom values", () => {
      const result = list(0, 2, "x");
      expect(result).toEqual(["x", "x", "x"]);
    });
  });
});
