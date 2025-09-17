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
      <div class="text-xl font-bold p-2 b b-solid b-amber mt-2 h-400px overflow-auto">
        <div class="h-1000px">
          <div class="p-2 bg-blue mt-100px" ref={setRef}>
            element1
          </div>
          <div class="p-2 bg-blue mt-100px mt-10" ref={setRef2}>
            element2
          </div>
        </div>
      </div>
    </div>
  );
}
