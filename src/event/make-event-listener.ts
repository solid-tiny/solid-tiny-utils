/** biome-ignore-all lint/suspicious/noExplicitAny: I need any */
import { onCleanup } from 'solid-js';
import { noop } from '~/fn';
import { isArray } from '~/lodash';
import type { Fn, MaybeArray } from '~/types';

interface InferEventTarget<Events> {
  addEventListener: (event: Events, fn?: any, options?: any) => any;
  removeEventListener: (event: Events, fn?: any, options?: any) => any;
}
export type WindowEventName = keyof WindowEventMap;
export type DocumentEventName = keyof DocumentEventMap;
export type GeneralEventListener<E = Event> = (evt: E) => void;
/**
 * Overload 1: Omitted Window target
 */
export function makeEventListener<E extends WindowEventName>(
  event: MaybeArray<E>,
  listener: MaybeArray<(this: Window, ev: WindowEventMap[E]) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;

/**
 * Overload 2: Explicitly Window target
 */
export function makeEventListener<E extends WindowEventName>(
  target: Window,
  event: E,
  listener: MaybeArray<(this: Window, ev: WindowEventMap[E]) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;
/**
 * Overload 2.1: Explicitly Window target
 */
export function makeEventListener<EventType = Event>(
  target: Window,
  event: WindowEventName[],
  listener: MaybeArray<(this: Window, ev: EventType) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;

/**
 * Overload 3: Explicitly Document target
 */
export function makeEventListener<E extends DocumentEventName>(
  target: DocumentOrShadowRoot,
  event: E,
  listener: MaybeArray<(this: Document, ev: DocumentEventMap[E]) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;
/**
 * Overload 3.1: Explicitly Document target
 */
export function makeEventListener<EventType = Event>(
  target: DocumentOrShadowRoot,
  event: DocumentEventName[],
  listener: MaybeArray<(this: Document, ev: EventType) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;

/**
 * Overload 4: Explicitly HTMLElement target
 */
export function makeEventListener<
  T extends HTMLElement,
  E extends keyof HTMLElementEventMap,
>(
  target: T,
  event: E | (keyof HTMLElementEventMap)[],
  listener: MaybeArray<(this: T, ev: HTMLElementEventMap[E]) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;
/**
 * Overload 4.1: Explicitly HTMLElement target
 */
export function makeEventListener<T extends HTMLElement, EventType = Event>(
  target: T,
  event: (keyof HTMLElementEventMap)[],
  listener: MaybeArray<(this: T, ev: EventType) => void>,
  options?: boolean | AddEventListenerOptions
): Fn;

/**
 * Overload 5: Custom event target with event type infer
 */
export function makeEventListener<Names extends string, EventType = Event>(
  target: InferEventTarget<Names>,
  event: MaybeArray<Names>,
  listener: MaybeArray<GeneralEventListener<EventType>>,
  options?: boolean | AddEventListenerOptions
): Fn;

/**
 * Overload 6: Custom event target fallback
 */
export function makeEventListener<EventType = Event>(
  target: EventTarget,
  event: MaybeArray<string>,
  listener: MaybeArray<GeneralEventListener<EventType>>,
  options?: boolean | AddEventListenerOptions
): Fn;

export function makeEventListener(...args: any[]): Fn {
  let target: EventTarget | undefined;
  let events: string[];
  let listeners: Fn[];
  let options: AddEventListenerOptions | undefined | boolean;

  if (typeof args[0] === 'string' || isArray(args[0])) {
    // @ts-expect-error should ignore
    [events, listeners, options] = args;
    target = window;
  } else {
    [target, events, listeners, options] = args;
  }

  if (!target) {
    return noop;
  }

  if (!isArray(events)) {
    events = [events];
  }
  if (!isArray(listeners)) {
    listeners = [listeners];
  }

  const cleanups: Fn[] = [];
  const cleanup = () => {
    for (const c of cleanups) {
      c();
    }
    cleanups.length = 0;
  };

  const register = (el: any, event: string, listener: any, opts: any) => {
    el.addEventListener(event, listener, opts);
    return () => el.removeEventListener(event, listener, opts);
  };

  cleanups.push(
    ...events.flatMap((event) =>
      listeners.map((listener) => register(target, event, listener, options))
    )
  );

  const stop = () => {
    cleanup();
  };

  onCleanup(stop);

  return stop;
}
