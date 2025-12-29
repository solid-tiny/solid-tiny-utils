import { createSignal, Show } from "solid-js";
import { createPresence, dataIf } from "~/index";

import "./create-presence.css";

export default function Index() {
  const [visible, setVisible] = createSignal(false);
  const [withAnimation, setWithAnimation] = createSignal(true);
  const [ref, setRef] = createSignal<HTMLElement | undefined>();

  const presence = createPresence({
    show: visible,
    element: ref,
  });

  return (
    <div class="h-600px select-none">
      <div class="b b-solid b-gray-300 p-2">
        <div class="flex items-center gap-2">
          <button
            class="b b-solid b-blue px-3 py-1"
            onClick={() => setVisible((s) => !s)}
          >
            {visible() ? "Hide" : "Show"}
          </button>

          <button
            class="b b-solid b-green px-3 py-1"
            onClick={() => setWithAnimation((s) => !s)}
          >
            {withAnimation() ? "Disable Animation" : "Enable Animation"}
          </button>

          <div>presence.show: {presence.show() ? "true" : "false"}</div>
          <div class="ml-4">state: {presence.state()}</div>
        </div>
      </div>

      <div class="mt-3">
        <Show when={presence.show()}>
          <div
            class={`b b-solid ${withAnimation() ? "with-animated" : ""} mt-3 bg-blue p-4`}
            data-closing={dataIf(presence.state() === "closing")}
            data-opening={dataIf(presence.state() === "opening")}
            ref={setRef}
          >
            <div class="font-bold">I am a presence-controlled element</div>
            <div class="mt-2 text-sm opacity-80">
              `createPresence` will auto detects animation support.
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
