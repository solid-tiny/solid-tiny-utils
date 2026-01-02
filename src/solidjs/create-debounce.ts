import { onCleanup } from "solid-js";
import type { MaybeAccessor } from "~/types";
import { access } from "./utils";

export function createDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: MaybeAccessor<number>
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    clearTimeout(timeoutId);
  });

  const run = (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, access(delay));
  };

  return run;
}
