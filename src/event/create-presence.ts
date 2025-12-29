import { type Accessor, createSignal } from "solid-js";
import { hasAnimation } from "../dom";
import { noop } from "../fn";
import { access, createWatch } from "../reactive";
import type { MaybeAccessor } from "../types/maybe";
import { makeEventListener } from ".";

export type PresenceState = "opening" | "opened" | "closing" | "closed";
export function createPresence(params: {
  show: Accessor<boolean>;
  element: MaybeAccessor<HTMLElement | undefined>;
}) {
  const [state, setState] = createSignal<PresenceState>(
    access(params.show) ? "opened" : "closed"
  );

  createWatch(
    params.show,
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
        clear = makeEventListener(
          el,
          "animationend",
          () => {
            setState(current === "opening" ? "opened" : "closed");
          },
          { once: true }
        );
      } else {
        setState(current === "opening" ? "opened" : "closed");
      }
    }
  });

  return {
    show: () => state() !== "closed",
    state,
  };
}
