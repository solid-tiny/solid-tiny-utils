import { createSignal, For, Show } from "solid-js";
import {
  createOnMotionEnd,
  createWatch,
  runAtNextAnimationFrame,
} from "~/index";

export default function OnMotionEndPage() {
  const [ref, setRef] = createSignal<HTMLElement | undefined>();

  const [msgs, setMsgs] = createSignal<string[]>([]);

  const [status, setStatus] = createSignal("opened");

  createOnMotionEnd(ref, ({ type }) => {
    if (type === "transitioncancel") {
      return;
    }
    setStatus((s) => s.replace("ing", "ed"));
  });

  createWatch(msgs, (msgs) => {
    const maxLength = 5;
    if (msgs.length > maxLength) {
      setMsgs(msgs.slice(msgs.length - maxLength));
    }
  });

  createWatch(status, (status) => {
    if (status === "opening-pending") {
      runAtNextAnimationFrame(() => {
        setStatus("opening");
      });
    }
  });

  return (
    <div>
      <div class="b b-solid b-gray-300 p-2">
        <div>
          <For each={msgs()}>{(msg) => <div>{msg}</div>}</For>
        </div>
      </div>
      <div class="b b-solid b-amber mt-2 h-400px overflow-auto p-2 font-bold text-xl">
        <div class="h-1000px">
          <button
            onClick={() =>
              setStatus(
                status().startsWith("open") ? "closing" : "opening-pending"
              )
            }
          >
            Toggle Element 1
          </button>
          <Show when={status() !== "closed"}>
            <div
              class="mt-100px translate-y-0 p-2"
              classList={{
                "translate-y-10": ["opening", "opened"].includes(status()),
                "translate-y-0": status().startsWith("clos"),
              }}
              data-status={status()}
              ref={setRef}
              style={{
                transition: "transform 1s",
              }}
            >
              element1
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
