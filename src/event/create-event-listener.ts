/** biome-ignore-all lint/suspicious/noExplicitAny: I need any */
import { onCleanup } from 'solid-js';
import { noop } from '~/fn';
import { isArray } from '~/lodash';
import { access, createWatch } from '~/reactive';
import type { Fn, MaybeAccessor, MaybeArray } from '~/types';
import {
  type DocumentEventName,
  type GeneralEventListener,
  makeEventListener,
  type WindowEventName,
} from './make-event-listener';

/**
 * Overload 2: Explicitly Window target
 */
export function createEventListener<E extends WindowEventName>(
  target: MaybeAccessor<Window | undefined | null>,
  event: MaybeAccessor<MaybeArray<E>>,
  listener: MaybeArray<(this: Window, ev: WindowEventMap[E]) => void>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions | undefined>
): Fn;

/**
 * Overload 3: Explicitly Document target
 */
export function createEventListener<E extends DocumentEventName>(
  target: MaybeAccessor<DocumentOrShadowRoot | undefined | null>,
  event: MaybeAccessor<MaybeArray<E>>,
  listener: MaybeArray<(this: Document, ev: DocumentEventMap[E]) => void>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions | undefined>
): Fn;

/**
 * Overload 4: Explicitly HTMLElement target
 */
export function createEventListener<
  T extends HTMLElement,
  E extends keyof HTMLElementEventMap,
>(
  target: MaybeAccessor<T | undefined | null>,
  event: MaybeAccessor<MaybeArray<E>>,
  listener: MaybeArray<(this: T, ev: HTMLElementEventMap[E]) => void>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions | undefined>
): Fn;

/**
 * Overload 6: Custom event target fallback
 */
export function createEventListener<EventType = Event>(
  target: MaybeAccessor<EventTarget | undefined | null>,
  event: MaybeAccessor<MaybeArray<string>>,
  listener: MaybeArray<GeneralEventListener<EventType>>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions | undefined>
): Fn;

export function createEventListener(...args: any[]): Fn {
  const target: MaybeAccessor<EventTarget | undefined | null> = args[0];
  const events: MaybeAccessor<string[] | undefined> = args[1];
  let listeners: Fn[] = args[2];
  const options: MaybeAccessor<boolean | AddEventListenerOptions | undefined> =
    args[3] ?? noop;

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

  createWatch(
    () => [access(target), access(events), access(options)] as const,
    ([tars, evs, opts]) => {
      cleanup();

      if (!(tars && evs)) {
        return;
      }
      cleanups.push(makeEventListener(tars, evs, listeners, opts));
    }
  );

  onCleanup(cleanup);

  return cleanup;
}
