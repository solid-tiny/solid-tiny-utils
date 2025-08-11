import { onCleanup } from 'solid-js';
import { isNumber } from '~/lodash';
import { access, createWatch } from '~/reactive';
import type { MaybeAccessor, MaybePromise } from '~/types/maybe';

/**
 * Repeatedly executes an asynchronous function with a specified delay between each execution.
 * The loop continues until the surrounding SolidJS effect is cleaned up.
 *
 * @param fn - The asynchronous function to execute in a loop. Can return a promise or void.
 * @param delay - The delay (in milliseconds) between each execution. Can be a number or a reactive accessor.
 * If `false` or < 0, the loop will not execute.
 *
 * @remarks
 * - The loop is automatically stopped when cleanup.
 * - `fn`'s error will not stop scheduling.
 * - Uses `setTimeout` for scheduling and `onCleanup` for resource management.
 */
export function createLoopExec(
  fn: () => MaybePromise<void>,
  delay: MaybeAccessor<number | false>
) {
  let shouldStop = false;
  let isCleanedUp = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const execFn = async () => {
    clearTimeout(timer);
    const d = access(delay);
    if (shouldStop || !isNumber(d) || d < 0) {
      return;
    }
    try {
      await fn();
    } finally {
      timer = setTimeout(() => {
        execFn();
      }, d);
    }
  };

  createWatch(
    () => access(delay),
    () => {
      execFn();
    }
  );

  const stop = () => {
    shouldStop = true;
    clearTimeout(timer);
  };

  const start = () => {
    if (isCleanedUp) {
      return;
    }
    shouldStop = false;
    execFn();
  };

  onCleanup(() => {
    isCleanedUp = true;
    stop();
  });

  return {
    stop,
    start,
  };
}
