import { createMemo, createSignal, Show } from "solid-js";
import { makePresence } from "~/solidjs";

export const route = {
  info: {
    title: "makePresence",
  },
};

export default function Index() {
  const [visible, setVisible] = createSignal(true);
  const [enterDuration, setEnterDuration] = createSignal(300);
  const [exitDuration, setExitDuration] = createSignal(500);

  const item = createMemo(() => (visible() ? ({ id: 1 } as const) : undefined));

  const presence = makePresence(item, {
    enterDuration,
    exitDuration,
    initialEnter: true,
  });

  const duration = createMemo(() => {
    if (presence.isExiting()) {
      return exitDuration();
    }
    return enterDuration();
  });

  return (
    <div class="h-600px select-none">
      <div class="b b-solid b-gray-300 p-2">
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="b b-solid b-blue px-3 py-1"
            onClick={() => setVisible((s) => !s)}
            type="button"
          >
            {visible() ? "Hide" : "Show"}
          </button>

          <label class="flex items-center gap-2">
            <span class="text-sm">enter</span>
            <input
              class="w-90px"
              max={2000}
              min={0}
              onInput={(e) => setEnterDuration(Number(e.currentTarget.value))}
              step={50}
              type="number"
              value={enterDuration()}
            />
            <span class="text-sm opacity-70">ms</span>
          </label>

          <label class="flex items-center gap-2">
            <span class="text-sm">exit</span>
            <input
              class="w-90px"
              max={2000}
              min={0}
              onInput={(e) => setExitDuration(Number(e.currentTarget.value))}
              step={50}
              type="number"
              value={exitDuration()}
            />
            <span class="text-sm opacity-70">ms</span>
          </label>

          <div class="flex items-center gap-2 text-sm">
            <div>
              mounted: <b>{presence.isMounted() ? "true" : "false"}</b>
            </div>
            <div>
              visible: <b>{presence.isVisible() ? "true" : "false"}</b>
            </div>
            <div>
              animating: <b>{presence.isAnimating() ? "true" : "false"}</b>
            </div>
            <div>
              entering: <b>{presence.isEntering() ? "true" : "false"}</b>
            </div>
            <div>
              exiting: <b>{presence.isExiting() ? "true" : "false"}</b>
            </div>
          </div>
        </div>
      </div>

      <Show when={presence.isMounted()}>
        <div
          class="max-w-520px overflow-hidden rounded-md bg-gray-200"
          classList={{
            "opacity-0  h-0 mt-0": !presence.isVisible(),
            "opacity-100  h-80px mt-10px ": presence.isVisible(),
          }}
          style={{
            transition: `opacity ${duration()}ms ease, height ${duration()}ms ease, margin-top ${duration()}ms ease`,
          }}
        >
          <div class="font-bold">makePresence demo</div>
          <div class="mt-2 text-sm opacity-80">
            This element stays mounted during exit, then unmounts after
            {` ${exitDuration()}ms`}.
          </div>
        </div>
      </Show>

      <div class="mt-4 text-sm opacity-70">
        mountedItem: {presence.mountedItem() ? "{ id: 1 }" : "undefined"}
      </div>
    </div>
  );
}
