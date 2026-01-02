import { onCleanup } from "solid-js";
import { access } from "~/solidjs";
import type { MaybeAccessor } from "~/types";

export function createThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: MaybeAccessor<number>
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    clearTimeout(timeoutId);
  });

  const run = (...args: Args) => {
    if (timeoutId) {
      return;
    }
    timeoutId = setTimeout(() => {
      callback(...args);
      timeoutId = undefined;
    }, access(delay));
  };

  return run;
}
