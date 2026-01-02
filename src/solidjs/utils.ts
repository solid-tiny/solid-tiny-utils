/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import type { JSX } from "solid-js";
import type { MaybeAccessor } from "~/types/maybe";
import { isFn } from "~/utils";

export function access<T>(value: MaybeAccessor<T>): T {
  return isFn(value) ? value() : value;
}

export function runSolidEventHandler<
  T,
  E extends Event,
  EHandler extends JSX.EventHandler<T, any> = JSX.EventHandler<T, E>,
>(event: E, handler?: EHandler | JSX.BoundEventHandler<T, E, EHandler>) {
  if (typeof handler === "function") {
    handler(event);
  }

  if (Array.isArray(handler)) {
    handler[0](handler[1], event);
  }
}

export type MaybeCallableChild<T extends unknown[] = []> =
  | JSX.Element
  | ((...args: T) => JSX.Element);
export function callMaybeCallableChild<T extends unknown[] = []>(
  children: MaybeCallableChild<T>,
  ...args: T
) {
  return isFn(children) ? children(...args) : children;
}
