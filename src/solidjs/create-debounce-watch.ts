import type { Accessor, AccessorArray, OnOptions } from "solid-js";
import { createDebounce } from "~/solidjs";
import { createWatch } from "./create-watch";

/**
 * Creates a debounced watch effect.
 *
 * opt.delay - The debounce delay in milliseconds. Default is 10ms.
 */
export function createDebouncedWatch<S, Next extends Prev, Prev = Next>(
  targets: AccessorArray<S> | Accessor<S>,
  fn: (input: S, prevInput?: S) => void,
  opt?: OnOptions & {
    delay?: number;
  }
) {
  const debounceFn = createDebounce(fn, opt?.delay ?? 10);
  createWatch(targets, debounceFn, opt);
}
