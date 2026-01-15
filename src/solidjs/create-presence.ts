import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";
import type { MaybeAccessor } from "~/types";
import { isDefined, noop, runAtNextAnimationFrame } from "~/utils";
import { createWatch } from "./create-watch";
import { access } from "./utils";

export interface MakePresenceOptions {
  enterDuration: MaybeAccessor<number>;
  exitDuration: MaybeAccessor<number>;
  initialEnter?: boolean;
}

export type PresencePhase =
  | "idle"
  | "pre-enter"
  | "entering"
  | "entered"
  | "exiting"
  | "exited";

function makeTimeout(ms: Accessor<number>, fn: () => void) {
  if (ms() <= 0) {
    fn();
    return noop;
  }

  const timeoutId = setTimeout(() => {
    fn();
  }, ms());

  return () => clearTimeout(timeoutId);
}

/**
 * Animates the appearance of its children.
 *
 * @internal - to be combined with `createPresence` in the future
 */
function createPresenceBase(
  /** Indicates whether the component that the resulting values will be used upon should be visible to the user. */
  source: Accessor<boolean>,
  options: MakePresenceOptions
) {
  const enterDuration = () => access(options.enterDuration);
  const exitDuration = () => access(options.exitDuration);

  const initialSource = untrack(source);

  let initialPhase = "idle" as PresencePhase;
  if (initialSource) {
    initialPhase = options.initialEnter ? "pre-enter" : "entered";
  }

  const [phase, setPhase] = createSignal<PresencePhase>(initialPhase);

  let clear = noop;
  onCleanup(clear);

  createWatch(source, (visible) => {
    setPhase((prev) => {
      if (visible) {
        if (prev === "idle" || prev === "exited") {
          return "pre-enter";
        }
        return prev;
      }
      if (prev === "entered" || prev === "entering") {
        return "exiting";
      }
      return prev;
    });
  });

  createWatch(phase, (currentPhase) => {
    clear();

    if (currentPhase === "pre-enter") {
      runAtNextAnimationFrame(() => {
        // reflow();
        setPhase("entering");
      });
    }

    if (currentPhase === "entering") {
      clear = makeTimeout(enterDuration, () => setPhase("entered"));
    }

    if (currentPhase === "exiting") {
      clear = makeTimeout(exitDuration, () => setPhase("exited"));
    }

    if (currentPhase === "exited") {
      setPhase("idle");
    }
  });

  const isVisible = createMemo(() => ["entering", "entered"].includes(phase()));
  const isMounted = createMemo(() => phase() !== "idle");
  const isExiting = createMemo(() => phase() === "exiting");
  const isEntering = createMemo(() => phase() === "entering");
  const isAnimating = createMemo(() => isEntering() || isExiting());

  return {
    isMounted,
    isVisible,
    isAnimating,
    isEntering,
    isExiting,
    phase,
  };
}

const itemShouldBeMounted = <TItem>(item: TItem) =>
  item !== false && item != null;

export function createPresence<TItem>(
  item: Accessor<TItem | undefined>,
  options: MakePresenceOptions
) {
  const initial = untrack(item);
  const [mountedItem, setMountedItem] = createSignal(initial);
  const [shouldBeMounted, setShouldBeMounted] = createSignal(
    itemShouldBeMounted(initial)
  );
  const { isMounted, ...rest } = createPresenceBase(shouldBeMounted, options);

  createEffect(() => {
    if (mountedItem() !== item()) {
      if (isMounted()) {
        setShouldBeMounted(false);
      } else if (itemShouldBeMounted(item())) {
        setMountedItem(() => item());
        setShouldBeMounted(true);
      }
    } else if (!itemShouldBeMounted(item())) {
      setShouldBeMounted(false);
    } else if (itemShouldBeMounted(item())) {
      setShouldBeMounted(true);
    }
  });

  return {
    ...rest,
    isMounted: () => isMounted() && isDefined(mountedItem()),
    mountedItem,
  };
}
