import { makeEventListener } from '@solid-primitives/event-listener';
import { access } from '~/reactive';
import type { MaybeAccessor } from '~/types';

export function createClickOutside(
  target: MaybeAccessor<HTMLElement | null | undefined>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options?: {
    ignore?: MaybeAccessor<HTMLElement | null | undefined>[];
  }
) {
  const listener = (e: MouseEvent | TouchEvent) => {
    const el = access(target);
    if (!el || el.contains(e.target as Node)) {
      return;
    }
    if (options?.ignore) {
      for (const item of options.ignore) {
        const ignoreEl = access(item);
        if (
          ignoreEl &&
          (ignoreEl === e.target || ignoreEl.contains(e.target as Node))
        ) {
          return;
        }
      }
    }
    handler(e);
  };

  makeEventListener(document, 'click', listener);
  makeEventListener(document, 'touchstart', listener);
}
