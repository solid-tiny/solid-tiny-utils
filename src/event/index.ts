export * from "./create-click-outside";
export * from "./create-event-listener";
export * from "./create-intersection-observer";
export * from "./create-visibility-observer";
export * from "./make-event-listener";
export * from "./on-motion-end";

import type { JSX } from "solid-js/jsx-runtime";

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
