import { describe, expect, it } from "vitest";
import { sleep } from "~/utils";

describe("Async utilities", () => {
  describe("sleep", () => {
    it("should delay execution", async () => {
      const start = Date.now();
      await sleep(10);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(10);
    });

    it("should return a promise", () => {
      const result = sleep(1);
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
