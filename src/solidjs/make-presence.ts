import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";
import type { MaybeAccessor } from "~/types";
import { isDefined } from "~/utils";
import { access } from "./utils";

export interface MakePresenceOptions {
  enterDuration: MaybeAccessor<number>;
  exitDuration: MaybeAccessor<number>;
  initialEnter?: boolean;
}

/**
 * Animates the appearance of its children.
 *
 * @internal - to be combined with `createPresence` in the future
 */
function makePresenceBase(
  /** Indicates whether the component that the resulting values will be used upon should be visible to the user. */
  source: Accessor<boolean>,
  options: MakePresenceOptions
) {
  const enterDuration = () => access(options.enterDuration);
  const exitDuration = () => access(options.exitDuration);

  const initialSource = untrack(source);
  const initialState = options.initialEnter ? false : initialSource;
  const [isVisible, setIsVisible] = createSignal(initialState);
  const [isMounted, setIsMounted] = createSignal(initialSource);
  const [hasEntered, setHasEntered] = createSignal(initialState);

  const isExiting = createMemo(() => isMounted() && !source());
  const isEntering = createMemo(() => source() && !hasEntered());
  const isAnimating = createMemo(() => isEntering() || isExiting());

  createEffect(() => {
    if (source()) {
      // `animateVisible` needs to be set to `true` in a second step, as
      // when both flags would be flipped at the same time, there would
      // be no transition. See the second effect below.
      setIsMounted(true);
    } else {
      setHasEntered(false);
      setIsVisible(false);

      const timeoutId = setTimeout(() => {
        setIsMounted(false);
      }, exitDuration());

      onCleanup(() => clearTimeout(timeoutId));
    }
  });

  createEffect(() => {
    if (source() && isMounted() && !isVisible()) {
      document.body.offsetHeight; // force reflow

      const animationFrameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      onCleanup(() => cancelAnimationFrame(animationFrameId));
    }
  });

  createEffect(() => {
    if (isVisible() && !hasEntered()) {
      const timeoutId = setTimeout(() => {
        setHasEntered(true);
      }, enterDuration());

      onCleanup(() => clearTimeout(timeoutId));
    }
  });

  return {
    isMounted,
    isVisible,
    isAnimating,
    isEntering,
    isExiting,
  };
}

const itemShouldBeMounted = <TItem>(item: TItem) =>
  item !== false && item != null;

export function makePresence<TItem>(
  item: Accessor<TItem | undefined>,
  options: MakePresenceOptions
) {
  const initial = untrack(item);
  const [mountedItem, setMountedItem] = createSignal(initial);
  const [shouldBeMounted, setShouldBeMounted] = createSignal(
    itemShouldBeMounted(initial)
  );
  const { isMounted, ...rest } = makePresenceBase(shouldBeMounted, options);

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
