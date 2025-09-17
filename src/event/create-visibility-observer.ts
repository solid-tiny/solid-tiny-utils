import { type Accessor, createSignal, onCleanup } from "solid-js";
import { access, createWatch } from "~/reactive";
import type { MaybeNullableAccessor } from "~/types";
import { isObject } from "~/utils";

export type UseVisibilityObserverFn = (
  target: MaybeNullableAccessor<HTMLElement>
) => Accessor<boolean>;
export type CreateVisibilityObserverOption = IntersectionObserverInit & {
  initialValue?: boolean;
};
export type EntryCallback = (
  entry: IntersectionObserverEntry,
  instance: IntersectionObserver
) => void;

export function createVisibilityObserver(
  options?: CreateVisibilityObserverOption
): UseVisibilityObserverFn;
export function createVisibilityObserver(
  target: MaybeNullableAccessor<HTMLElement>,
  options?: CreateVisibilityObserverOption
): Accessor<boolean>;

export function createVisibilityObserver(
  arg1?: MaybeNullableAccessor<HTMLElement> | CreateVisibilityObserverOption,
  arg2?: CreateVisibilityObserverOption
): UseVisibilityObserverFn | Accessor<boolean> {
  let target: MaybeNullableAccessor<HTMLElement> | undefined;
  let options: CreateVisibilityObserverOption;

  if (arg1 && !isObject(arg1)) {
    target = arg1;
    options = arg2 ?? {};
  } else {
    options = (arg1 as CreateVisibilityObserverOption) ?? {};
  }

  const callbacks = new WeakMap<Element, EntryCallback>();

  const io = new IntersectionObserver((entries, instance) => {
    for (const entry of entries) {
      callbacks.get(entry.target)?.(entry, instance);
    }
  }, options);
  onCleanup(() => io.disconnect());
  const addEntry = (el: Element, callback: EntryCallback) => {
    io.observe(el);
    callbacks.set(el, callback);
  };
  const removeEntry = (el: Element) => {
    io.unobserve(el);
    callbacks.delete(el);
  };

  const useVisibilityObserverFn: UseVisibilityObserverFn = (element) => {
    const [isVisible, setVisible] = createSignal(
      options?.initialValue ?? false
    );

    let prevEl: HTMLElement;
    createWatch(
      () => access(element),
      (el) => {
        if (prevEl) {
          removeEntry(prevEl);
        }
        if (el) {
          addEntry(el, (entry) => {
            setVisible(entry.isIntersecting);
          });
          prevEl = el;
        }
      }
    );

    return isVisible;
  };

  if (target) {
    return useVisibilityObserverFn(target);
  }
  return useVisibilityObserverFn;
}
