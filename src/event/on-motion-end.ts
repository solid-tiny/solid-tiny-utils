import { onCleanup } from "solid-js";
import { noop } from "~/fn";
import { createWatch } from "~/reactive";
import { makeEventListener } from "./make-event-listener";

type Accessor<T> = () => T;

export type OnMotionEndType =
  | "animationend"
  | "transitionend"
  | "transitioncancel"
  | "no-motion";

export interface OnMotionEndOptions {
  /**
   * Specifies which type of motion to listen for.
   *
   * @default "auto"
   */
  motionType?: "animation" | "transition" | "auto";
  /**
   * If true, the callback will be executed immediately if there are no motions on the element.
   *
   * @default true
   */
  execWhenNoMotion?: boolean;

  /**
   * If true, 'transitioncancel' events will also be detected and treated as motion end.
   *
   * @default false
   */
  detectCancelled?: boolean;
}
/**
 * Calls the callback when all CSS motions (animations and transitions) on the element have ended.
 *
 * if opt.motionType is set to "auto" (default), both animations and transitions are considered,
 * but animation takes precedence if both are present.
 *
 *
 * @example
 * ```ts
 * import { makeOnMotionEnd } from "solid-tiny-utils/event";
 *
 * const el = document.getElementById("my-element");
 *
 * makeOnMotionEnd(el, () => {
 *   console.log("All motions ended!");
 * });
 * ```
 */
export function makeOnMotionEnd(
  el: HTMLElement,
  cb: (params: { type: OnMotionEndType }) => void,
  opt: OnMotionEndOptions = {}
) {
  const node = el;
  const style = getComputedStyle(node);
  const {
    motionType = "auto",
    execWhenNoMotion = true,
    detectCancelled = false,
  } = opt;
  const allowAnimation = motionType === "animation" || motionType === "auto";
  const allowTransition = motionType === "transition" || motionType === "auto";

  const cleanups: (() => void)[] = [];

  const cleanup = () => {
    for (const c of cleanups) {
      c();
    }
  };

  const resolve = (params: { type: OnMotionEndType }) => {
    cb(params);
  };

  if (allowAnimation) {
    const animNames = style.animationName.split(",").map((s) => s.trim());
    const animationIterationCounts = style.animationIterationCount
      .split(",")
      .map((s) => s.trim());

    function onAnimEnd(e: AnimationEvent) {
      if (e.target !== node) {
        return;
      }
      resolve({ type: "animationend" });
    }

    if (
      style.animationName &&
      style.animationName !== "none" &&
      animNames.length > 0 &&
      animationIterationCounts.some((count) => count !== "infinite")
    ) {
      cleanups.push(makeEventListener(node, ["animationend"], onAnimEnd));
      onCleanup(cleanup);
      return cleanup;
    }
  }

  if (allowTransition) {
    const transProps = style.transitionProperty.split(",").map((s) => s.trim());
    const transPending = new Set();

    function onTransEnd(e: TransitionEvent) {
      if (e.target !== node) {
        return;
      }
      transPending.delete(e.propertyName);
      if (transPending.size === 0) {
        resolve({ type: e.type as "transitionend" | "transitioncancel" });
      }
    }

    function onTransRun(e: TransitionEvent) {
      if (e.target !== node) {
        return;
      }
      // in case a new transition starts, we need to ensure we listen for its end
      transPending.add(e.propertyName);
    }

    if (transProps.length > 0) {
      const events = detectCancelled
        ? ["transitionend", "transitioncancel"]
        : ["transitionend"];

      cleanups.push(
        makeEventListener(node, events, onTransEnd),
        makeEventListener(node, "transitionrun", onTransRun)
      );

      onCleanup(cleanup);
      return cleanup;
    }
  }

  if (execWhenNoMotion) {
    cb({ type: "no-motion" });
  }
  return cleanup;
}

/** * Reactive version of `makeOnMotionEnd`.
 *
 * @example
 * ```ts
 * import { createOnMotionEnd } from "solid-tiny-utils/event";
 * import { createSignal } from "solid-js";
 *
 * const [el, setEl] = createSignal<HTMLElement | undefined>(undefined);
 *
 * createOnMotionEnd(el, () => {
 *   console.log("All motions ended!");
 * });
 * ```
 */
export function createOnMotionEnd(
  el: Accessor<HTMLElement | undefined>,
  cb: (params: { type: OnMotionEndType }) => void,
  opt?: OnMotionEndOptions
) {
  let cleanup: () => void = noop;

  createWatch(el, (node) => {
    cleanup();
    if (node) {
      cleanup = makeOnMotionEnd(node, cb, opt);
    }
  });
}
