import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { access } from "~/solidjs";

describe("access", () => {
  it("should return value directly for non-function values", () => {
    expect(access(42)).toBe(42);
    expect(access("hello")).toBe("hello");
    expect(access(true)).toBe(true);
    expect(access(null)).toBe(null);
    expect(access(undefined)).toBe(undefined);
    expect(access({ key: "value" })).toEqual({ key: "value" });
    expect(access([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("should call function and return its result for accessor functions", () => {
    createRoot(() => {
      const [signal, setSignal] = createSignal(10);

      expect(access(signal)).toBe(10);

      setSignal(20);
      expect(access(signal)).toBe(20);

      // Test with computed value
      const doubled = () => signal() * 2;
      expect(access(doubled)).toBe(40);
    });
  });

  it("should work with nested function calls", () => {
    createRoot(() => {
      const [count, setCount] = createSignal(5);
      const getCount = () => count();
      const getDoubledCount = () => getCount() * 2;

      expect(access(getDoubledCount)).toBe(10);

      setCount(7);
      expect(access(getDoubledCount)).toBe(14);
    });
  });

  it("should handle complex object accessors", () => {
    createRoot(() => {
      const [user, setUser] = createSignal({ name: "John", age: 30 });

      expect(access(user)).toEqual({ name: "John", age: 30 });

      setUser({ name: "Jane", age: 25 });
      expect(access(user)).toEqual({ name: "Jane", age: 25 });
    });
  });

  it("should preserve function behavior for non-signal functions", () => {
    const regularFunction = () => "not a signal";
    expect(access(regularFunction)).toBe("not a signal");
  });

  it("should work with boolean accessors", () => {
    createRoot(() => {
      const [isVisible, setIsVisible] = createSignal(false);

      expect(access(isVisible)).toBe(false);

      setIsVisible(true);
      expect(access(isVisible)).toBe(true);
    });
  });

  it("should work with array accessors", () => {
    createRoot(() => {
      const [items, setItems] = createSignal(["a", "b"]);

      expect(access(items)).toEqual(["a", "b"]);

      setItems(["x", "y", "z"]);
      expect(access(items)).toEqual(["x", "y", "z"]);
    });
  });
});
