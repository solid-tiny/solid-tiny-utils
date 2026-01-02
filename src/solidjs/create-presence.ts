import { type Accessor, createMemo, createSignal } from "solid-js";
import { hasAnimation } from "../dom";
import { access, createWatch } from "../solidjs";
import type { MaybeAccessor } from "../types/maybe";
import { noop } from "../utils";
import { makeEventListener } from ".";

export type PresenceState = "opening" | "opened" | "closing" | "closed";
export function createPresence(params: {
  show: Accessor<boolean>;
  element: MaybeAccessor<HTMLElement | undefined>;
}) {
  const [state, setState] = createSignal<PresenceState>(
    access(params.show) ? "opened" : "closed"
  );

  const showMemo = createMemo(() => access(params.show));

  createWatch(
    showMemo,
    (show) => {
      if (show) {
        setState("opening");
      } else {
        setState("closing");
      }
    },
    { defer: true }
  );

  let clear = noop;
  createWatch(state, (current) => {
    clear();
    const el = access(params.element);
    if (!el) {
      return;
    }

    if (current.endsWith("ing")) {
      if (hasAnimation(el)) {
        clear = makeEventListener(el, "animationend", () => {
          setState(current === "opening" ? "opened" : "closed");
        });
      } else {
        setState(current === "opening" ? "opened" : "closed");
      }
    }
  });

  const shouldRender = createMemo(() => state() !== "closed");
  return [shouldRender, state] as const;
}
