import { createRoot, createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDebouncedWatch } from "~/solidjs";

describe("createDebouncedWatch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should watch a single signal and execute callback on changes", async () => {
    const callback = vi.fn(() => "return");

    const setCount = createRoot(() => {
      const [count, s] = createSignal(0);
      createDebouncedWatch(count, callback);

      return s;
    });

    // Should be called immediately with initial value
    expect(callback).toHaveBeenCalledTimes(0);
    await vi.advanceTimersByTimeAsync(10);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(0, undefined, undefined);

    setCount(1);
    expect(callback).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(10);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(1, 0, undefined);
  });

  it("should work with custom delay", async () => {
    const callback = vi.fn(() => "return");

    const setCount = createRoot(() => {
      const [count, s] = createSignal(0);
      createDebouncedWatch(count, callback, { delay: 100 });

      return s;
    });

    await vi.advanceTimersByTimeAsync(50);
    // Should be called immediately with initial value
    expect(callback).toHaveBeenCalledTimes(0);
    await vi.advanceTimersByTimeAsync(50);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(0, undefined, undefined);

    setCount(1);
    expect(callback).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(100);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(1, 0, undefined);
  });
});
