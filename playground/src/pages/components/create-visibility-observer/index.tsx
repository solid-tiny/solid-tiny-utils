import { createSignal } from "solid-js";
import { createVisibilityObserver } from "~/index";

export default function Index() {
  const [ref, setRef] = createSignal<HTMLElement | undefined>();
  const [ref2, setRef2] = createSignal<HTMLElement | undefined>();

  const useVisibilityObserver = createVisibilityObserver();
  const isVisible = useVisibilityObserver(ref);
  const isVisible2 = useVisibilityObserver(ref2);

  return (
    <div>
      <div class="b b-solid b-gray-300 p-2">
        <div>
          {isVisible() ? "Element1 is visible" : "Element1 is not visible"}
        </div>
        <div>
          {isVisible2() ? "Element2 is visible" : "Element2 is not visible"}
        </div>
      </div>
      <div class="b b-solid b-amber mt-2 h-400px overflow-auto p-2 font-bold text-xl">
        <div class="h-1000px">
          <div class="mt-100px bg-blue p-2" ref={setRef}>
            element1
          </div>
          <div class="mt-10 mt-100px bg-blue p-2" ref={setRef2}>
            element2
          </div>
        </div>
      </div>
    </div>
  );
}
