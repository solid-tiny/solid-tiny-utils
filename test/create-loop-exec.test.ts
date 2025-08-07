import { createRoot, createSignal } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLoopExec } from '~/fn';
import { ignoreRejections } from './common';

describe('createLoopExec', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should execute function repeatedly with static delay', async () => {
    const mockFn = vi.fn();
    const delay = 100;

    createRoot(() => {
      createLoopExec(mockFn, delay);
    });

    // Initial execution should happen immediately
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance timers by delay and check if function is called again
    await vi.advanceTimersByTimeAsync(delay);
    expect(mockFn).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(delay);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should execute function repeatedly with reactive delay', async () => {
    const mockFn = vi.fn();

    const setDelay = createRoot(() => {
      const [delay, s] = createSignal(100);

      createLoopExec(mockFn, delay);
      return s;
    });

    // Initial execution
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance by initial delay
    await vi.advanceTimersByTimeAsync(100);
    expect(mockFn).toHaveBeenCalledTimes(2);

    // Change delay and advance by new delay
    setDelay(200);
    expect(mockFn).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(200);
    expect(mockFn).toHaveBeenCalledTimes(4);
  });

  it('should handle async functions', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue(undefined);
    const delay = 100;

    createRoot(() => {
      createLoopExec(mockAsyncFn, delay);
    });

    // Initial execution
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);

    // Advance timers
    await vi.advanceTimersByTimeAsync(delay);
    expect(mockAsyncFn).toHaveBeenCalledTimes(2);
  });

  it('should handle async functions that throw errors', async ({
    onTestFinished,
  }) => {
    ignoreRejections(onTestFinished);
    const error = new Error('Test error');
    const mockAsyncFn = vi.fn().mockRejectedValue(error);
    const delay = 100;

    createRoot(() => {
      createLoopExec(mockAsyncFn, delay);
    });

    // Initial execution
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);

    // Even if the function throws, it should continue executing
    await vi.advanceTimersByTimeAsync(delay);
    expect(mockAsyncFn).toHaveBeenCalledTimes(2);
  });

  it('should stop execution when component is disposed', async () => {
    const mockFn = vi.fn();
    const delay = 100;

    const dispose = createRoot((d) => {
      createLoopExec(mockFn, delay);

      return d;
    });

    // Initial execution
    expect(mockFn).toHaveBeenCalledTimes(1);

    dispose();
    // Advance timers - function should not be called again
    await vi.advanceTimersByTimeAsync(delay * 5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should clear existing timers when new execution is scheduled', async () => {
    const mockFn = vi.fn();
    const delay = 100;
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    createRoot(() => {
      createLoopExec(mockFn, delay);
    });

    // Initial execution
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance timers to trigger next execution
    await vi.advanceTimersByTimeAsync(delay);
    expect(mockFn).toHaveBeenCalledTimes(2);

    // clearTimeout should be called before each new timeout is set
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should work with zero delay', async () => {
    const mockFn = vi.fn();
    const delay = 0;

    createRoot(() => {
      createLoopExec(mockFn, delay);
    });

    // Initial execution
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance by zero delay
    await vi.advanceTimersByTimeAsync(0);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should able to stop and start manually', async () => {
    const mockFn = vi.fn();
    const delay = 100;

    const [loop, dispose] = createRoot((d) => {
      return [createLoopExec(mockFn, delay), d] as const;
    });

    await vi.advanceTimersByTimeAsync(delay);
    expect(mockFn).toHaveBeenCalledTimes(2);
    loop.stop();
    await vi.advanceTimersByTimeAsync(delay * 10);
    expect(mockFn).toHaveBeenCalledTimes(2);
    loop.start();
    // Should start executing again immediately
    expect(mockFn).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(delay);
    expect(mockFn).toHaveBeenCalledTimes(4);

    dispose();
    await vi.advanceTimersByTimeAsync(delay * 10);
    expect(mockFn).toHaveBeenCalledTimes(4);
    // can not start after dispose
    loop.start();
    await vi.advanceTimersByTimeAsync(delay * 10);
    expect(mockFn).toHaveBeenCalledTimes(4);
  });
});
