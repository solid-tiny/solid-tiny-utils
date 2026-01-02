import type { JSX } from "solid-js";
import type { MaybeAccessor } from "~/types/maybe";
import { isFn } from "~/utils";

export function access<T>(value: MaybeAccessor<T>): T {
  return isFn(value) ? value() : value;
}

export function runSolidEventHandler<
  T,
  E extends Event,
  // biome-ignore lint/suspicious/noExplicitAny: any
  EHandler extends JSX.EventHandler<T, any> = JSX.EventHandler<T, E>,
>(event: E, handler?: EHandler | JSX.BoundEventHandler<T, E, EHandler>) {
  if (typeof handler === "function") {
    handler(event);
  }

  if (Array.isArray(handler)) {
    handler[0](handler[1], event);
  }
}
