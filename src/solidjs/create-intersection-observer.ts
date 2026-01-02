import { onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { access, createWatch } from "~/solidjs";
import type { Fn, MaybeAccessor } from "~/types";
import { clearArray } from "~/utils";
import { noop } from "../utils";

export function createIntersectionObserver(
  targets: MaybeAccessor<HTMLElement | null | undefined>[],
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  if (isServer) {
    return noop;
  }

  const io = new IntersectionObserver(callback, options);
  onCleanup(() => io.disconnect());
  const cleanups: Fn[] = [];
  const cleanup = () => {
    for (const c of cleanups) {
      c();
    }
    clearArray(cleanups);
  };

  createWatch(
    () => targets.map(access),
    (elements) => {
      cleanup();

      for (const element of elements) {
        if (element) {
          io.observe(element);
          cleanups.push(() => io.unobserve(element));
        }
      }
    }
  );

  return () => io.disconnect();
}
